import React from 'react';
import { Modal, Descriptions, Button, Image, Tag } from 'antd';
import moment from 'moment';

interface CourseDetailProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: Course.IRecord;
	title?: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ isVisible, onClose, onEdit, record, title = 'khóa học' }) => {
	if (!record) return null;

	const getStatusTag = (status: string) => {
		const statusMap = {
			pending: { color: 'warning', text: 'Chờ duyệt' },
			approved: { color: 'success', text: 'Đã duyệt' },
			rejected: { color: 'error', text: 'Từ chối' },
		};
		const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
		return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

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
				<Descriptions.Item label='Tên khóa học' span={2}>
					<strong style={{ fontSize: 18 }}>{record.title}</strong>
				</Descriptions.Item>

				<Descriptions.Item label='Mã khóa học'>
					<Tag color='blue'>{record.course_code}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>{getStatusTag(record.status)}</Descriptions.Item>

				<Descriptions.Item label='Giá'>
					<span style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>{formatPrice(record.price)}</span>
				</Descriptions.Item>
				<Descriptions.Item label='Danh mục'>{record.category_id}</Descriptions.Item>

				<Descriptions.Item label='Giảng viên'>{record.instructor}</Descriptions.Item>
				<Descriptions.Item label='Số người học tối đa'>{record.max_learners || 'Không giới hạn'}</Descriptions.Item>

				<Descriptions.Item label='Có chứng chỉ'>
					<Tag color={record.has_certification ? 'green' : 'red'}>{record.has_certification ? 'Có' : 'Không'}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Tỷ lệ hoa hồng'>
					{record.commission_rate ? `${(record.commission_rate * 100).toFixed(2)}%` : 'Không có'}
				</Descriptions.Item>

				<Descriptions.Item label='Số lượng đăng ký'>
					<Tag color='blue'>{record.enrolled_count || 0}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Đánh giá trung bình'>
					{record.avg_rating ? (
						<span style={{ color: '#faad14' }}>⭐ {record.avg_rating.toFixed(1)}</span>
					) : (
						'Chưa có đánh giá'
					)}
				</Descriptions.Item>

				<Descriptions.Item label='Ngày tạo'>
					{record.created_at ? moment(record.created_at).format('DD/MM/YYYY HH:mm') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày cập nhật'>
					{record.updated_at ? moment(record.updated_at).format('DD/MM/YYYY HH:mm') : ''}
				</Descriptions.Item>

				<Descriptions.Item label='Ngày phát hành' span={2}>
					{record.published_at ? moment(record.published_at).format('DD/MM/YYYY') : 'Chưa phát hành'}
				</Descriptions.Item>

				<Descriptions.Item label='Thumbnail' span={2}>
					{record.thumbnail ? (
						<Image
							src={record.thumbnail}
							alt={record.title}
							width={200}
							style={{ borderRadius: '8px' }}
							fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L'
						/>
					) : (
						<span style={{ color: '#999' }}>Không có ảnh</span>
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

export default CourseDetail;
