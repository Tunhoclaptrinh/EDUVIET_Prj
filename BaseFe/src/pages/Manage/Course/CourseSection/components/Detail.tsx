import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';
import moment from 'moment';

interface CourseSectionDetailProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: CourseSection.IRecord;
	title?: string;
}

const CourseSectionDetail: React.FC<CourseSectionDetailProps> = ({
	isVisible,
	onClose,
	onEdit,
	record,
	title = 'chương học',
}) => {
	if (!record) return null;

	return (
		<Modal
			title={`Chi tiết ${title}`}
			visible={isVisible}
			onCancel={onClose}
			footer={
				<div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
					<Button key='back' onClick={onClose}>
						Đóng
					</Button>
					<Button key='edit' type='primary' onClick={onEdit}>
						Chỉnh sửa
					</Button>
				</div>
			}
			width={800}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Tiêu đề chương' span={2}>
					<strong style={{ fontSize: 18 }}>{record.title}</strong>
				</Descriptions.Item>

				<Descriptions.Item label='ID' span={2}>
					<Tag color='blue'>{record.id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Khóa học'>
					<Tag color='green'>{record.course_id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Thứ tự'>
					<Tag color='orange'>{record.order_number}</Tag>
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

export default CourseSectionDetail;
