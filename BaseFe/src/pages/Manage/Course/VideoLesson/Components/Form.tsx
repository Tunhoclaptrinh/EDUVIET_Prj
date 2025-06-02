import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, message, Space, Switch, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import LessonSelect from '../../Lesson/components/Select';
import {
	PlayCircleOutlined,
	SafetyCertificateOutlined,
	FileProtectOutlined,
	LinkOutlined,
	FileTextOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

interface VideoLessonFormProps {
	title?: string;
}

const VideoLessonForm: React.FC<VideoLessonFormProps> = ({ title = 'video bài học', ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('course.videoLesson');
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	// Reset form and populate data when opening
	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			const formData = {
				...record,
			};
			form.setFieldsValue(formData);
		}
	}, [record?.id, visibleForm, form]);

	// Helper function to detect video platform
	const detectVideoPlatform = (url: string) => {
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			return 'YouTube';
		} else if (url.includes('vimeo.com')) {
			return 'Vimeo';
		} else if (url.includes('storage.')) {
			return 'Storage';
		} else {
			return 'Other';
		}
	};

	const validateFormData = (values: any): string | null => {
		if (!values.lesson_id) {
			return 'Vui lòng chọn bài học';
		}

		if (!values.video_url?.trim()) {
			return 'Vui lòng nhập URL video';
		}

		// Validate URL format
		try {
			new URL(values.video_url);
		} catch {
			return 'URL video không hợp lệ';
		}

		return null;
	};

	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);

			// Validate form data
			const validationError = validateFormData(values);
			if (validationError) {
				message.error(validationError);
				return;
			}

			// Prepare base submit data
			const baseSubmitData = {
				lesson_id: values.lesson_id,
				video_url: values.video_url?.trim(),
				embed_code: values.embed_code?.trim() || null,
				transcript: values.transcript?.trim() || null,
				prevent_skipping: values.prevent_skipping || false,
				encryption_key: values.encryption_key?.trim() || null,
			};

			let submitData: VideoLesson.IRecord;
			let result;

			if (edit) {
				// For editing: include all fields including IDs
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				submitData = {
					...baseSubmitData,
					id: record.id,
					created_at: record.created_at,
					updated_at: new Date().toISOString(),
				};
				result = await putModel(record.id, submitData);
			} else {
				// For creating: only include necessary fields, no ID
				const now = new Date().toISOString();
				submitData = {
					...baseSubmitData,
					created_at: now,
					updated_at: now,
				} as VideoLesson.IRecord;
				result = await postModel(submitData);
			}

			// Check if the operation was successful
			if (result) {
				message.success(`${edit ? 'Cập nhật' : 'Thêm mới'} video bài học thành công`);
				setVisibleForm(false);
				resetFieldsForm(form);
			} else {
				throw new Error('Operation failed');
			}
		} catch (error: any) {
			console.error('Form submission error:', error);
			const errorMessage =
				error?.response?.data?.message || error?.message || `${edit ? 'Cập nhật' : 'Thêm mới'} video bài học thất bại`;
			message.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setVisibleForm(false);
		resetFieldsForm(form);
	};

	// Watch video URL to show platform info
	const watchedVideoUrl = Form.useWatch('video_url', form);
	const videoPlatform = watchedVideoUrl ? detectVideoPlatform(watchedVideoUrl) : null;

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					{/* Thông tin cơ bản */}
					<Card type='inner' title='📹 Thông tin video cơ bản' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item label='Bài học' name='lesson_id' rules={[...rules.required]}>
									<LessonSelect placeholder='Chọn bài học để thêm video' approvedOnly={false} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label={
										<span>
											<PlayCircleOutlined style={{ marginRight: 4 }} />
											URL Video
											{videoPlatform && (
												<span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
													(Nền tảng: {videoPlatform})
												</span>
											)}
										</span>
									}
									name='video_url'
									rules={[
										...rules.required,
										{
											type: 'url',
											message: 'Vui lòng nhập URL hợp lệ',
										},
									]}
								>
									<Input
										placeholder='https://www.youtube.com/watch?v=... hoặc https://vimeo.com/...'
										prefix={<PlayCircleOutlined />}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label={
										<span>
											<LinkOutlined style={{ marginRight: 4 }} />
											Mã nhúng (Embed Code)
										</span>
									}
									name='embed_code'
									rules={[
										{
											max: 5000,
											message: 'Mã nhúng tối đa 5000 ký tự',
										},
									]}
								>
									<TextArea
										rows={4}
										placeholder='<iframe src="..." width="560" height="315" frameborder="0"></iframe>'
										showCount
										maxLength={5000}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Transcript */}
					<Card
						type='inner'
						title={
							<span>
								<FileTextOutlined style={{ marginRight: 8 }} />
								Transcript (Phụ đề/Bảng chép)
							</span>
						}
						style={{ marginBottom: 16 }}
					>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Nội dung transcript'
									name='transcript'
									rules={[
										{
											max: 10000,
											message: 'Transcript tối đa 10000 ký tự',
										},
									]}
								>
									<TextArea
										rows={6}
										placeholder='Nhập nội dung transcript/phụ đề của video...'
										showCount
										maxLength={10000}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Cài đặt bảo mật */}
					<Card
						type='inner'
						title={
							<span>
								<SafetyCertificateOutlined style={{ marginRight: 8 }} />
								Cài đặt bảo mật
							</span>
						}
						style={{ marginBottom: 16 }}
					>
						<Row gutter={[16, 0]}>
							<Col span={12}>
								<Form.Item
									label={
										<span>
											<FileProtectOutlined style={{ marginRight: 4 }} />
											Chống tua video
										</span>
									}
									name='prevent_skipping'
									valuePropName='checked'
									initialValue={false}
									tooltip='Ngăn người học tua nhanh video'
								>
									<Switch checkedChildren='Bật' unCheckedChildren='Tắt' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label={
										<span>
											<SafetyCertificateOutlined style={{ marginRight: 4 }} />
											Khóa mã hóa
										</span>
									}
									name='encryption_key'
									tooltip='Khóa để mã hóa video (nếu có)'
									rules={[
										{
											max: 255,
											message: 'Khóa mã hóa tối đa 255 ký tự',
										},
									]}
								>
									<Input.Password placeholder='Nhập khóa mã hóa (tùy chọn)' visibilityToggle />
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						<div
							style={{
								padding: '12px',
								backgroundColor: '#f6ffed',
								border: '1px solid #b7eb8f',
								borderRadius: '6px',
								fontSize: '13px',
								color: '#389e0d',
							}}
						>
							<strong>💡 Lưu ý về bảo mật:</strong>
							<ul style={{ margin: '8px 0 0 16px', paddingLeft: 0 }}>
								<li>Chống tua: Giúp đảm bảo học viên xem hết video</li>
								<li>Mã hóa: Bảo vệ nội dung video khỏi truy cập trái phép</li>
								<li>Embed code: Cho phép nhúng video vào các trang khác</li>
							</ul>
						</div>
					</Card>

					<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
						<Space size='large'>
							<Button loading={submitting} htmlType='submit' type='primary' size='large' icon={<PlayCircleOutlined />}>
								{edit ? 'Lưu lại' : 'Thêm mới'}
							</Button>
							<Button onClick={handleCancel} size='large'>
								Hủy
							</Button>
						</Space>
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default VideoLessonForm;
