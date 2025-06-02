import React, { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Popover, message, Button } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlayCircleOutlined,
	FileProtectOutlined,
	SafetyCertificateOutlined,
	LinkOutlined,
	FileTextOutlined,
} from '@ant-design/icons';
import VideoLessonForm from './Components/Form';
import VideoLessonDetail from './Components/Detail';

const VideoLessonPage = () => {
	const { handleEdit, deleteModel, danhSach } = useModel('course.videoLesson');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<VideoLesson.IRecord | undefined>();

	const onView = (record: VideoLesson.IRecord) => {
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

	// Helper function to format URL display
	const formatUrlDisplay = (url: string) => {
		if (!url) return 'Chưa có URL';

		try {
			const urlObj = new URL(url);
			const domain = urlObj.hostname;
			const filename = urlObj.pathname.split('/').pop() || '';

			return `${domain}/${filename}`;
		} catch {
			return url.length > 50 ? `${url.substring(0, 50)}...` : url;
		}
	};

	// Helper function to get video platform
	const getVideoPlatform = (url: string) => {
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			return { name: 'YouTube', color: 'red' };
		} else if (url.includes('vimeo.com')) {
			return { name: 'Vimeo', color: 'blue' };
		} else if (url.includes('storage.')) {
			return { name: 'Storage', color: 'green' };
		} else {
			return { name: 'Other', color: 'default' };
		}
	};

	const columns: IColumn<VideoLesson.IRecord>[] = [
		{
			title: 'ID Bài học',
			dataIndex: 'lesson_id',
			width: 100,
			sortable: true,
			align: 'center',
			render: (val) => <Tag color='blue'>#{val}</Tag>,
		},
		{
			title: 'Video URL',
			dataIndex: 'video_url',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (url: string) => {
				const platform = getVideoPlatform(url);
				return (
					<div>
						<Tag color={platform.color} icon={<PlayCircleOutlined />} style={{ marginBottom: 4 }}>
							{platform.name}
						</Tag>
						<br />
						<Popover
							content={
								<div style={{ maxWidth: '400px', wordBreak: 'break-all' }}>
									<a href={url} target='_blank' rel='noopener noreferrer'>
										{url}
									</a>
								</div>
							}
							title='URL đầy đủ'
							trigger='hover'
						>
							<div
								style={{
									color: '#1890ff',
									cursor: 'pointer',
									fontSize: '12px',
								}}
							>
								{formatUrlDisplay(url)}
							</div>
						</Popover>
					</div>
				);
			},
		},
		{
			title: 'Mã nhúng',
			dataIndex: 'embed_code',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterOptions: [
				{ label: 'Có', value: true },
				{ label: 'Không', value: false },
			],
			render: (embedCode: string) => (
				<Tag color={embedCode ? 'green' : 'default'} icon={embedCode ? <LinkOutlined /> : undefined}>
					{embedCode ? 'Có' : 'Không'}
				</Tag>
			),
		},
		{
			title: 'Transcript',
			dataIndex: 'transcript',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterOptions: [
				{ label: 'Có', value: true },
				{ label: 'Không', value: false },
			],
			render: (transcript: string) => (
				<Tag color={transcript ? 'cyan' : 'default'} icon={transcript ? <FileTextOutlined /> : undefined}>
					{transcript ? 'Có' : 'Không'}
				</Tag>
			),
		},
		{
			title: 'Chống tua',
			dataIndex: 'prevent_skipping',
			width: 120,
			align: 'center',
			sortable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Bật', value: true },
				{ label: 'Tắt', value: false },
			],
			render: (preventSkipping: boolean) => (
				<Tag color={preventSkipping ? 'orange' : 'default'} icon={<FileProtectOutlined />}>
					{preventSkipping ? 'Bật' : 'Tắt'}
				</Tag>
			),
		},
		{
			title: 'Mã hóa',
			dataIndex: 'encryption_key',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterOptions: [
				{ label: 'Có', value: true },
				{ label: 'Không', value: false },
			],
			render: (encryptionKey: string) => (
				<Tag color={encryptionKey ? 'red' : 'default'} icon={<SafetyCertificateOutlined />}>
					{encryptionKey ? 'Có' : 'Không'}
				</Tag>
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
						title='Bạn có chắc chắn muốn xóa video bài học này?'
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
				modelName='course.videoLesson'
				title='Quản lý video bài học'
				Form={VideoLessonForm}
				widthDrawer={1000}
				buttons={{
					create: true,
					import: true,
					export: true,
					filter: true,
					reload: true,
				}}
				deleteMany
				rowSelection
			/>

			{/* Modal xem chi tiết */}
			{selectedRecord && (
				<VideoLessonDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='video bài học'
				/>
			)}
		</div>
	);
};

export default VideoLessonPage;
