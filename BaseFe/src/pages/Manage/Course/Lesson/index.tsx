import { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Popover, message } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlayCircleOutlined,
	FileTextOutlined,
	CheckOutlined,
} from '@ant-design/icons';
import LessonForm from './components/Form';
import LessonDetail from './components/Detail';
import { duyetLesson } from '@/services/Lesson';
import { ipLocal } from '@/utils/ip';

const LessonPage = () => {
	const { handleEdit, deleteModel, setRecord, getModel } = useModel('course.lesson');
	const { getModel: getVideoLesson } = useModel('course.videoLesson');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<Lesson.IRecord | undefined>();
	const [courses, setCourses] = useState<any[]>([]);
	const [sections, setSections] = useState<any[]>([]);

	// Fetch courses and sections
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [courseResponse, sectionResponse] = await Promise.all([
					fetch(`${ipLocal}/courses`),
					fetch(`${ipLocal}/courseSections`),
				]);
				if (!courseResponse.ok || !sectionResponse.ok) {
					throw new Error('Không thể tải dữ liệu khóa học hoặc chương');
				}
				const coursesData = await courseResponse.json();
				const sectionsData = await sectionResponse.json();
				setCourses(coursesData);
				setSections(sectionsData);
			} catch (error) {
				message.error('Không thể tải dữ liệu khóa học hoặc chương');
			}
		};
		fetchData();
	}, []);

	const getCourseTitle = (sectionId: string) => {
		const section = sections.find((s) => s.id == sectionId);
		if (!section) return 'Không xác định';
		const course = courses.find((c) => c.id === String(section.course_id));
		return course ? course.title : 'Không xác định';
	};

	const getSectionTitle = (sectionId: string) => {
		const section = sections.find((s) => s.id == sectionId);
		return section ? section.title : 'Không xác định';
	};

	const onView = (record: Lesson.IRecord) => {
		setSelectedRecord(record);
		setViewModalVisible(true);
	};

	const onCloseModal = () => {
		setViewModalVisible(false);
		setSelectedRecord(undefined);
	};

	const onEditFromView = () => {
		setViewModalVisible(false);
		if (selectedRecord) {
			handleEditWithVideo(selectedRecord);
		}
	};

	const handleEditWithVideo = async (record: Lesson.IRecord) => {
		try {
			let updatedRecord = { ...record };
			if (record.content_type === 'video') {
				const videoLesson = await getVideoLesson({ lesson_id: record.id });
				updatedRecord = { ...record, videoLesson: videoLesson?.[0] || null };
			}
			handleEdit(updatedRecord);
			setRecord(updatedRecord);
		} catch (error) {
			console.error('Error fetching video lesson:', error);
			message.error('Không thể tải dữ liệu video bài học');
			handleEdit(record);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved':
				return 'green';
			case 'pending':
				return 'orange';
			case 'rejected':
				return 'red';
			default:
				return 'default';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'approved':
				return 'Đã duyệt';
			case 'pending':
				return 'Chờ duyệt';
			case 'rejected':
				return 'Bị từ chối';
			default:
				return status;
		}
	};

	const getContentTypeDisplay = (contentType: string) => {
		switch (contentType) {
			case 'video':
				return { icon: <PlayCircleOutlined />, text: 'Video', color: 'blue' };
			case 'text':
				return { icon: <FileTextOutlined />, text: 'Văn bản', color: 'green' };
			default:
				return { icon: <FileTextOutlined />, text: contentType, color: 'default' };
		}
	};

	const columns: IColumn<Lesson.IRecord>[] = [
		{
			title: 'Khóa học',
			dataIndex: 'section_id',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (sectionId: string) => (
				<div style={{ fontWeight: 500, color: '#1890ff' }}>{getCourseTitle(sectionId)}</div>
			),
		},
		{
			title: 'Chương',
			dataIndex: 'section_id',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (sectionId: string) => (
				<div style={{ fontWeight: 500, color: '#1890ff' }}>{getSectionTitle(sectionId)}</div>
			),
		},
		{
			title: 'Tiêu đề bài học',
			dataIndex: 'title',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (val) => <div style={{ fontWeight: 500, color: '#1890ff' }}>{val}</div>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 250,
			render: (val) => (
				<Popover
					content={<div style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto' }}>{val}</div>}
					title='Mô tả đầy đủ'
					trigger='hover'
				>
					<div
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '250px',
							cursor: 'pointer',
						}}
					>
						{val || 'Không có mô tả'}
					</div>
				</Popover>
			),
		},
		{
			title: 'Loại nội dung',
			dataIndex: 'content_type',
			width: 120,
			sortable: true,
			filterType: 'select',
			filterData: ['video', 'text'],
			render: (contentType: string) => {
				const display = getContentTypeDisplay(contentType);
				return (
					<Tag color={display.color} icon={display.icon}>
						{display.text}
					</Tag>
				);
			},
		},
		{
			title: 'Thời lượng',
			dataIndex: 'duration_minutes',
			width: 100,
			sortable: true,
			align: 'center',
			render: (duration: number) => <Tag color='purple'>{duration} phút</Tag>,
		},
		{
			title: 'Thứ tự',
			dataIndex: 'order_number',
			width: 80,
			sortable: true,
			align: 'center',
			render: (order: number) => <Tag color='default'>#{order}</Tag>,
		},
		{
			title: 'Xem trước miễn phí',
			dataIndex: 'is_free_preview',
			width: 120,
			align: 'center',
			render: (isFree: boolean) => <Tag color={isFree ? 'green' : 'default'}>{isFree ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			sortable: true,
			filterType: 'select',
			filterData: ['approved', 'pending', 'rejected'],
			render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 160,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => onView(record)} type='link' icon={<EyeOutlined />} />
					<Popconfirm
						title='Bạn có chắc chắn muốn duyệt bài học này?'
						placement='topLeft'
						onConfirm={async () => {
							try {
								await duyetLesson(record);
								message.success('Duyệt bài học thành công!');
								getModel();
							} catch (error) {
								message.error('Duyệt bài học thất bại!');
							}
						}}
					>
						<ButtonExtend
							tooltip='Duyệt'
							type='link'
							className='btn-success'
							icon={<CheckOutlined />}
							disabled={record.status === 'approved'}
						/>
					</Popconfirm>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						onClick={() => handleEditWithVideo(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa bài học này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<TableBase
				columns={columns}
				modelName='course.lesson'
				title='Quản lý bài học'
				Form={LessonForm}
				widthDrawer={900}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			{selectedRecord && (
				<LessonDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='bài học'
					courses={courses}
					sections={sections}
				/>
			)}
		</div>
	);
};

export default LessonPage;
