import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';
import { PlayCircleOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

interface LessonDetailProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: Lesson.IRecord;
	title?: string;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ isVisible, onClose, onEdit, record, title = 'bài học' }) => {
	if (!record) return null;

	// Helper functions
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

	const contentTypeDisplay = getContentTypeDisplay(record.content_type);

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
			width={900}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Tiêu đề bài học' span={2}>
					<strong style={{ fontSize: 18 }}>{record.title}</strong>
				</Descriptions.Item>

				<Descriptions.Item label='ID'>
					<Tag color='blue'>{record.id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='ID Phần'>
					<Tag color='purple'>{record.section_id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Loại nội dung'>
					<Tag color={contentTypeDisplay.color} icon={contentTypeDisplay.icon}>
						{contentTypeDisplay.text}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Thời lượng'>
					<Tag color='purple'>{record.duration_minutes} phút</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Thứ tự'>
					<Tag color='default'>#{record.order_number}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Xem trước miễn phí'>
					<Tag
						color={record.is_free_preview ? 'green' : 'default'}
						icon={record.is_free_preview ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
					>
						{record.is_free_preview ? 'Có' : 'Không'}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Trạng thái' span={2}>
					<Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
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

				<Descriptions.Item label='Ngày tạo'>
					<Tag color='cyan'>{moment(record.created_at).format('DD/MM/YYYY HH:mm')}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Ngày cập nhật'>
					<Tag color='cyan'>{moment(record.updated_at).format('DD/MM/YYYY HH:mm')}</Tag>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default LessonDetail;
