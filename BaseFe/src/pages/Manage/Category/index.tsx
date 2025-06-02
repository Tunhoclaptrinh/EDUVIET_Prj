import React, { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Popover, message } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import CategoryForm from './components/Form';
import CategoryDetail from './components/Detail';

const CategoryPage = () => {
	const { handleEdit, deleteModel, danhSach } = useModel('category');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<Category.IRecord | undefined>();

	const onView = (record: Category.IRecord) => {
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

	const columns: IColumn<Category.IRecord>[] = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 100,
			sortable: true,
			align: 'center',
			filterType: 'string',
			render: (val) => <Tag color='blue'>{val}</Tag>,
		},
		{
			title: 'Tên danh mục',
			dataIndex: 'name',
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
							maxWidth: '230px',
							cursor: 'pointer',
						}}
					>
						{val || 'Không có mô tả'}
					</div>
				</Popover>
			),
		},
		{
			title: 'Danh mục cha',
			dataIndex: 'parent_category_id',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (parentId: string) => {
				if (!parentId) {
					return <Tag color='default'>Danh mục gốc</Tag>;
				}

				// Tìm danh mục cha theo ID
				const parentCategory = danhSach.find((cat: Category.IRecord) => String(cat.id) === String(parentId));

				if (!parentCategory) {
					return <Tag color='red'>Không tìm thấy</Tag>;
				}

				return <Tag color='green'>{parentCategory.name}</Tag>;
			},
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
						title='Bạn có chắc chắn muốn xóa danh mục này?'
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
				modelName='category'
				title='Quản lý danh mục'
				Form={CategoryForm}
				widthDrawer={800}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>

			{/* Modal xem chi tiết */}
			{selectedRecord && (
				<CategoryDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='danh mục'
				/>
			)}
		</div>
	);
};

export default CategoryPage;
