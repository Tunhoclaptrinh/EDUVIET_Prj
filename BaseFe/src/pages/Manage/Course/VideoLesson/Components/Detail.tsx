import React from 'react';
import { Modal, Descriptions, Button, Tag, Space, Divider } from 'antd';
import {
	PlayCircleOutlined,
	FileTextOutlined,
	SafetyCertificateOutlined,
	FileProtectOutlined,
	CloseCircleOutlined,
	CopyOutlined,
	LinkOutlined,
} from '@ant-design/icons';
import moment from 'moment';

interface VideoLessonDetailProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: VideoLesson.IRecord;
	title?: string;
}

const VideoLessonDetail: React.FC<VideoLessonDetailProps> = ({
	isVisible,
	onClose,
	onEdit,
	record,
	title = 'video bài học',
}) => {
	if (!record) return null;

	// Helper function to get video platform info
	const getVideoPlatform = (url: string) => {
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			return { name: 'YouTube', color: 'red', icon: <PlayCircleOutlined /> };
		} else if (url.includes('vimeo.com')) {
			return { name: 'Vimeo', color: 'blue', icon: <PlayCircleOutlined /> };
		} else if (url.includes('storage.')) {
			return { name: 'Storage', color: 'green', icon: <PlayCircleOutlined /> };
		} else {
			return { name: 'Other', color: 'default', icon: <PlayCircleOutlined /> };
		}
	};

	// Helper function to copy text to clipboard
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			// You can add a success message here if needed
		});
	};

	const platform = getVideoPlatform(record.video_url);

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
			width={1000}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='ID Video' span={1}>
					<Tag color='blue'>{record.id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='ID Bài học' span={1}>
					<Tag color='purple'>#{record.lesson_id}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Nền tảng video' span={2}>
					<Tag color={platform.color} icon={platform.icon}>
						{platform.name}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='URL Video' span={2}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<div
							style={{
								flex: 1,
								wordBreak: 'break-all',
								fontSize: 12,
								padding: '4px 8px',
								backgroundColor: '#f5f5f5',
								borderRadius: '4px',
							}}
						>
							{record.video_url}
						</div>
						<Space>
							<Button
								size='small'
								icon={<CopyOutlined />}
								onClick={() => copyToClipboard(record.video_url)}
								title='Copy URL'
							/>
							<Button
								size='small'
								icon={<LinkOutlined />}
								onClick={() => window.open(record.video_url, '_blank')}
								title='Mở video'
							/>
						</Space>
					</div>
				</Descriptions.Item>

				<Descriptions.Item label='Chống tua video' span={1}>
					<Tag
						color={record.prevent_skipping ? 'orange' : 'default'}
						icon={record.prevent_skipping ? <FileProtectOutlined /> : <CloseCircleOutlined />}
					>
						{record.prevent_skipping ? 'Bật' : 'Tắt'}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Mã hóa video' span={1}>
					<Tag
						color={record.encryption_key ? 'red' : 'default'}
						icon={record.encryption_key ? <SafetyCertificateOutlined /> : <CloseCircleOutlined />}
					>
						{record.encryption_key ? 'Có mã hóa' : 'Không mã hóa'}
					</Tag>
				</Descriptions.Item>

				{record.encryption_key && (
					<Descriptions.Item label='Khóa mã hóa' span={2}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<code
								style={{
									flex: 1,
									padding: '4px 8px',
									backgroundColor: '#f5f5f5',
									borderRadius: '4px',
									fontSize: '12px',
								}}
							>
								{record.encryption_key}
							</code>
							<Button
								size='small'
								icon={<CopyOutlined />}
								onClick={() => copyToClipboard(record.encryption_key!)}
								title='Copy encryption key'
							/>
						</div>
					</Descriptions.Item>
				)}

				<Descriptions.Item label='Mã nhúng' span={2}>
					<Tag
						color={record.embed_code ? 'green' : 'default'}
						icon={record.embed_code ? <LinkOutlined /> : <CloseCircleOutlined />}
					>
						{record.embed_code ? 'Có mã nhúng' : 'Không có mã nhúng'}
					</Tag>
				</Descriptions.Item>

				{record.embed_code && (
					<Descriptions.Item label='Chi tiết mã nhúng' span={2}>
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
							<pre
								style={{
									flex: 1,
									maxHeight: '120px',
									overflowY: 'auto',
									padding: '8px',
									backgroundColor: '#f5f5f5',
									borderRadius: '4px',
									fontSize: '11px',
									whiteSpace: 'pre-wrap',
									wordBreak: 'break-all',
								}}
							>
								{record.embed_code}
							</pre>
							<Button
								size='small'
								icon={<CopyOutlined />}
								onClick={() => copyToClipboard(record.embed_code!)}
								title='Copy embed code'
							/>
						</div>
					</Descriptions.Item>
				)}

				<Descriptions.Item label='Transcript' span={2}>
					<Tag
						color={record.transcript ? 'cyan' : 'default'}
						icon={record.transcript ? <FileTextOutlined /> : <CloseCircleOutlined />}
					>
						{record.transcript ? 'Có transcript' : 'Không có transcript'}
					</Tag>
				</Descriptions.Item>

				{record.transcript && (
					<Descriptions.Item label='Nội dung transcript' span={2}>
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
							<div
								style={{
									flex: 1,
									maxHeight: '150px',
									overflowY: 'auto',
									padding: '8px',
									backgroundColor: '#f9f9f9',
									borderRadius: '4px',
									lineHeight: '1.6',
									fontSize: '13px',
								}}
							>
								{record.transcript}
							</div>
							<Button
								size='small'
								icon={<CopyOutlined />}
								onClick={() => copyToClipboard(record.transcript!)}
								title='Copy transcript'
							/>
						</div>
					</Descriptions.Item>
				)}

				<Descriptions.Item label='Ngày tạo' span={1}>
					<Tag color='cyan'>{moment(record.created_at).format('DD/MM/YYYY HH:mm')}</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Ngày cập nhật' span={1}>
					<Tag color='cyan'>{moment(record.updated_at).format('DD/MM/YYYY HH:mm')}</Tag>
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation='left'>Thông tin bảo mật</Divider>
			<div
				style={{
					padding: '16px',
					backgroundColor: '#fafafa',
					borderRadius: '6px',
					border: '1px solid #f0f0f0',
				}}
			>
				<Space direction='vertical' style={{ width: '100%' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span>
							🛡️ <strong>Bảo vệ chống tua:</strong>
						</span>
						<Tag color={record.prevent_skipping ? 'success' : 'default'}>
							{record.prevent_skipping ? 'Được bảo vệ' : 'Không bảo vệ'}
						</Tag>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span>
							🔐 <strong>Mã hóa video:</strong>
						</span>
						<Tag color={record.encryption_key ? 'error' : 'default'}>
							{record.encryption_key ? 'Đã mã hóa' : 'Không mã hóa'}
						</Tag>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span>
							📝 <strong>Transcript:</strong>
						</span>
						<Tag color={record.transcript ? 'processing' : 'default'}>{record.transcript ? 'Có sẵn' : 'Chưa có'}</Tag>
					</div>
				</Space>
			</div>
		</Modal>
	);
};

export default VideoLessonDetail;
