import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';
import moment from 'moment';

interface CategoryDetailProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: Category.IRecord;
	title?: string;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ isVisible, onClose, onEdit, record, title = 'danh mục' }) => {
	if (!record) return null;

	return (
		<Modal
			title={`Chi tiết ${title}`}
			visible={isVisible}
			onCancel={onClose}
			footer={[
				<Button key='back' onClick={onClose}>
					Đóng
				</Button>,
				<Button key='edit' type='primary' onClick={onEdit}>
					Chỉnh sửa
				</Button>,
			]}
			width={800}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Tên danh mục' span={2}>
					<strong style={{ fontSize: 18 }}>{record.name}</strong>
				</Descriptions.Item>

				<Descriptions.Item label='ID' span={2}>
					<Tag color='blue'>{record.id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Danh mục cha' span={2}>
					{record.parent_category_id ? (
						<Tag color='green'>{record.parent_category_id}</Tag>
					) : (
						<span style={{ color: '#999' }}>Không có danh mục cha</span>
					)}
				</Descriptions.Item>

				<Descriptions.Item label='Mô tả' span={2}>
					<div
						style={{
							maxHeight: '120px',
							overflowY: 'auto',
							padding: '8px',
							backgroundColor: '#f5f5f5',
							borderRadius: '4px',
							lineHeight: '1.6',
						}}
					>
						{record.description || 'Không có mô tả'}
					</div>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default CategoryDetail;
