import React, { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Popover, message } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import CourseSectionForm from './components/Form';
import CourseSectionDetail from './components/Detail';

const SectionPage = () => {
	const { handleEdit, deleteModel, danhSach } = useModel('course.courseSection');
	const { danhSach: courseList } = useModel('course.courses');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<CourseSection.IRecord | undefined>();

	const onView = (record: CourseSection.IRecord) => {
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
			handleEdit(selectedRecord);
		}
	};

	// Tìm tên khóa học theo ID
	const getCourseName = (courseId: string | number) => {
		const course = courseList?.find((course: any) => String(course.id) === String(courseId));
		return course?.title || course?.name || 'Không xác định';
	};

	const columns: IColumn<CourseSection.IRecord>[] = [
		{
			title: 'Thứ tự',
			dataIndex: 'order_number',
			width: 80,
			align: 'center',
			sortable: true,
			render: (val) => (
				<Tag color='blue' style={{ fontSize: '14px', fontWeight: 'bold' }}>
					{val}
				</Tag>
			),
		},
		{
			title: 'Tiêu đề chương',
			dataIndex: 'title',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (val) => (
				<div
					style={{
						fontWeight: 500,
						color: '#1890ff',
					}}
				>
					{val}
				</div>
			),
		},
		{
			title: 'Khóa học',
			dataIndex: 'course_id',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (courseId: string | number) => <Tag color='green'>{getCourseName(courseId)}</Tag>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 300,
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
							maxWidth: '300px',
							cursor: 'pointer',
						}}
					>
						{val || 'Không có mô tả'}
					</div>
				</Popover>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => onView(record)} type='link' icon={<EyeOutlined />} />
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa chương học này?'
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
				modelName='course.courseSection'
				title='Quản lý chương học'
				Form={CourseSectionForm}
				widthDrawer={800}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>

			{/* Modal xem chi tiết */}
			{selectedRecord && (
				<CourseSectionDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='chương học'
				/>
			)}
		</div>
	);
};

export default SectionPage;
