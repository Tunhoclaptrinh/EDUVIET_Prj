import React, { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Popover, Image, message } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { CheckOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import CourseForm from './components/Form';
import CourseDetail from './components/Detail';
import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';
import { duyetCourse } from '@/services/Course';

const CoursePage = () => {
	const { handleEdit, deleteModel, getModel } = useModel('course.courses');
	const { getAllModel: getAllDanhMuc, danhSach: dsDanhMuc } = useModel('category');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<Course.IRecord | undefined>();

	useEffect(() => {
		getAllDanhMuc();
	}, []);

	const onView = (record: Course.IRecord) => {
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

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

	const columns: IColumn<Course.IRecord>[] = [
		{
			title: 'Mã Course',
			dataIndex: 'course_code',
			width: 120,
			sortable: true,
			align: 'center',
			filterType: 'string',
			render: (val) => <Tag color='blue'>{val}</Tag>,
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'title',
			width: 250,
			sortable: true,
			filterType: 'string',
			render: (val) => (
				<Popover content={val} title='Tên khóa học đầy đủ' trigger='hover'>
					<div
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '230px',
							cursor: 'pointer',
							fontWeight: 500,
						}}
					>
						{val}
					</div>
				</Popover>
			),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 200,
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
							maxWidth: '180px',
							cursor: 'pointer',
						}}
					>
						{val || 'Không có mô tả'}
					</div>
				</Popover>
			),
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			width: 150,
			sortable: true,
			align: 'right',
			render: (val) => <span style={{ fontWeight: 'bold', color: '#52c41a', marginRight: 8 }}>{formatPrice(val)}</span>,
		},
		{
			title: 'Danh mục',
			dataIndex: 'category_id',
			width: 180,
			sortable: true,
			filterType: 'string',
			render: (categoryId: string) => {
				// Đảm bảo so sánh đúng kiểu dữ liệu
				const category = dsDanhMuc.find((cat) => String(cat.id) === String(categoryId));

				if (!category) {
					return <Tag color='default'>Không xác định</Tag>;
				}

				return <div>{category.name}</div>;
			},
		},
		{
			title: 'Giảng viên',
			dataIndex: 'instructor',
			width: 120,
			sortable: true,
			align: 'center',
		},
		{
			title: 'Thumbnail',
			dataIndex: 'thumbnail',
			width: 100,
			align: 'center',
			render: (val) =>
				val ? (
					<Image
						src={val}
						width={50}
						height={35}
						style={{ objectFit: 'cover', borderRadius: '4px' }}
						fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L'
					/>
				) : (
					<span style={{ color: '#ccc' }}>No Image</span>
				),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: ['pending', 'approved', 'rejected'],
			render: (val) => {
				const statusMap = {
					pending: { color: 'warning', text: 'Chờ duyệt' },
					approved: { color: 'success', text: 'Đã duyệt' },
					rejected: { color: 'error', text: 'Từ chối' },
				};
				const status = statusMap[val as keyof typeof statusMap] || { color: 'default', text: val };
				return <Tag color={status.color}>{status.text}</Tag>;
			},
		},
		{
			title: 'SL đăng ký',
			dataIndex: 'enrolled_count',
			width: 100,
			sortable: true,
			align: 'center',
			render: (val) => <Tag color='blue'>{val || 0}</Tag>,
		},
		{
			title: 'Rating',
			dataIndex: 'avg_rating',
			width: 100,
			sortable: true,
			align: 'center',
			render: (val) =>
				val ? (
					<span style={{ color: '#faad14' }}>⭐ {val.toFixed(1)}</span>
				) : (
					<span style={{ color: '#ccc' }}>N/A</span>
				),
		},
		{
			title: 'Có chứng chỉ',
			dataIndex: 'has_certification',
			width: 110,
			align: 'center',
			filterType: 'select',
			filterData: ['true', 'false'],
			render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'created_at',
			width: 120,
			sortable: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Ngày phát hành',
			dataIndex: 'published_at',
			width: 130,
			sortable: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Chưa phát hành'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => onView(record)} type='link' icon={<EyeOutlined />} />
					<Popconfirm
						title='Bạn có chắc chắn muốn duyệt hồ sơ này?'
						placement='topLeft'
						onConfirm={async () => {
							try {
								await duyetCourse(record);
								message.success('Duyệt hồ sơ thành công!');
								getModel();
							} catch (error) {
								message.error('Duyệt hồ sơ thất bại!');
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
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa khóa học này?'
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
				modelName='course.courses'
				title='Quản lý khóa học'
				Form={CourseForm}
				widthDrawer={900}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>

			{/* Modal xem chi tiết */}
			{selectedRecord && (
				<CourseDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='khóa học'
				/>
			)}
		</div>
	);
};

export default CoursePage;
