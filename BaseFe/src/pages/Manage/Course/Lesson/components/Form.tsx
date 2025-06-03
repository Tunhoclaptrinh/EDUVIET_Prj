import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, message, Space, InputNumber, Switch, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import {
	PlayCircleOutlined,
	SafetyCertificateOutlined,
	FileProtectOutlined,
	LinkOutlined,
	FileTextOutlined,
} from '@ant-design/icons';
import { ipLocal } from '@/utils/ip';
import CourseSelect from '../../Course/components/Select';

const { Option } = Select;
const { TextArea } = Input;

interface LessonFormProps {
	title?: string;
}

const LessonForm: React.FC<LessonFormProps> = ({ title = 'bài học', ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('course.lesson');
	const { postModel: postVideoModel, putModel: putVideoModel } = useModel('course.videoLesson');
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);
	const [courses, setCourses] = useState<{ id: string | number; title: string }[]>([]);
	const [sections, setSections] = useState<{ id: string | number; title: string; course_id: string | number }[]>([]);

	// Fetch courses and sections
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch courses
				const courseResponse = await fetch(`${ipLocal}/courses`);
				if (!courseResponse.ok) throw new Error('Failed to fetch courses');
				const courseData = await courseResponse.json();
				setCourses(courseData);

				// Fetch sections
				const sectionResponse = await fetch(`${ipLocal}/courseSections`);
				if (!sectionResponse.ok) throw new Error('Failed to fetch sections');
				const sectionData = await sectionResponse.json();
				setSections(sectionData);
			} catch (error) {
				message.error('Không thể tải dữ liệu khóa học hoặc chương học');
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	// Initialize form data
	useEffect(() => {
		console.log('Form useEffect triggered. visibleForm:', visibleForm, 'record:', record);
		if (!visibleForm) {
			console.log('Resetting form due to visibleForm being false');
			resetFieldsForm(form);
		} else if (record) {
			const section = sections.find((s) => String(s.id) === String(record.section_id));
			const formData = {
				course_id: section ? String(section.course_id) : undefined,
				section_id: record.section_id || undefined,
				title: record.title || '',
				content_type: record.content_type || undefined,
				duration_minutes: record.duration_minutes || undefined,
				order_number: record.order_number || undefined,
				description: record.description || '',
				is_free_preview: record.is_free_preview || false,
				status: record.status || 'pending',
				video_url: record.videoLesson?.video_url || record.video_lesson?.video_url || '',
				embed_code: record.videoLesson?.embed_code || record.video_lesson?.embed_code || '',
				transcript: record.videoLesson?.transcript || record.video_lesson?.transcript || '',
				prevent_skipping: record.videoLesson?.prevent_skipping || record.video_lesson?.prevent_skipping || false,
				encryption_key: record.videoLesson?.encryption_key || record.video_lesson?.encryption_key || '',
			};
			console.log('Setting form values:', formData);
			form.setFieldsValue(formData);
		} else {
			console.log('No record provided, resetting form');
			resetFieldsForm(form);
		}
	}, [record, visibleForm, form, sections]);

	const detectVideoPlatform = (url: string) => {
		if (!url) return null;
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
		if (!values.title?.trim()) {
			return 'Vui lòng nhập tiêu đề bài học';
		}
		if (!values.course_id) {
			return 'Vui lòng chọn khóa học';
		}
		if (!values.section_id) {
			return 'Vui lòng chọn phần học';
		}
		if (!values.content_type) {
			return 'Vui lòng chọn loại nội dung';
		}
		if (!values.duration_minutes || values.duration_minutes <= 0) {
			return 'Vui lòng nhập thời lượng hợp lệ';
		}
		if (!values.order_number || values.order_number <= 0) {
			return 'Vui lòng nhập thứ tự hợp lệ';
		}
		if (values.content_type === 'video') {
			if (!values.video_url?.trim()) {
				return 'Vui lòng nhập URL video';
			}
			try {
				new URL(values.video_url);
			} catch {
				return 'URL video không hợp lệ';
			}
		}
		return null;
	};

	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);

			const validationError = validateFormData(values);
			if (validationError) {
				message.error(validationError);
				return;
			}

			const baseLessonData = {
				section_id: values.section_id,
				title: values.title?.trim(),
				description: values.description?.trim() || '',
				content_type: values.content_type,
				duration_minutes: values.duration_minutes,
				order_number: values.order_number,
				is_free_preview: values.is_free_preview || false,
				status: values.status || 'pending',
			};

			let lessonSubmitData: Lesson.IRecord;
			let lessonResult;
			let lessonId: string | number;

			if (edit) {
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				lessonSubmitData = {
					...baseLessonData,
					id: record.id,
					created_at: record.created_at,
					updated_at: new Date().toISOString(),
				};
				lessonResult = await putModel(record.id, lessonSubmitData);
				lessonId = record.id;
			} else {
				const now = new Date().toISOString();
				lessonSubmitData = {
					...baseLessonData,
					created_at: now,
					updated_at: now,
				} as Lesson.IRecord;
				lessonResult = await postModel(lessonSubmitData);
				lessonId = lessonResult?.id;
			}

			if (!lessonResult) {
				throw new Error('Lesson operation failed');
			}

			if (values.content_type === 'video') {
				const baseVideoData = {
					lesson_id: lessonId,
					video_url: values.video_url?.trim(),
					embed_code: values.embed_code?.trim() || null,
					transcript: values.transcript?.trim() || null,
					prevent_skipping: values.prevent_skipping || false,
					encryption_key: values.encryption_key?.trim() || null,
				};

				let videoSubmitData: VideoLesson.IRecord;
				let videoResult;

				if (edit && (record.videoLesson?.id || record.video_lesson?.id)) {
					videoSubmitData = {
						...baseVideoData,
						id: record.videoLesson?.id || record.video_lesson?.id,
						created_at: record.videoLesson?.created_at || record.video_lesson?.created_at,
						updated_at: new Date().toISOString(),
					};
					videoResult = await putVideoModel(videoSubmitData.id, videoSubmitData);
				} else {
					const now = new Date().toISOString();
					videoSubmitData = {
						...baseVideoData,
						created_at: now,
						updated_at: now,
					} as VideoLesson.IRecord;
					videoResult = await postVideoModel(videoSubmitData);
				}

				if (!videoResult) {
					throw new Error('Video lesson operation failed');
				}
			}

			message.success(
				`${edit ? 'Cập nhật' : 'Thêm mới'} bài học${values.content_type === 'video' ? ' và video' : ''} thành công`,
			);
			setVisibleForm(false);
			resetFieldsForm(form);
		} catch (error: any) {
			console.error('Form submission error:', error);
			const errorMessage =
				error?.response?.data?.message || error?.message || `${edit ? 'Cập nhật' : 'Thêm mới'} bài học thất bại`;
			message.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setVisibleForm(false);
		resetFieldsForm(form);
	};

	const watchedContentType = Form.useWatch('content_type', form);
	const watchedVideoUrl = Form.useWatch('video_url', form);
	const watchedCourseId = Form.useWatch('course_id', form);
	const videoPlatform = watchedVideoUrl ? detectVideoPlatform(watchedVideoUrl) : null;

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					<Card type='inner' title='📚 Thông tin cơ bản' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Tiêu đề bài học'
									name='title'
									rules={[...rules.required, { max: 200, message: 'Tiêu đề tối đa 200 ký tự' }]}
								>
									<Input placeholder='Nhập tiêu đề bài học' maxLength={200} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[16, 0]}>
							<Col span={12}>
								<Form.Item label='Khóa học' name='course_id' rules={[...rules.required]}>
									<Select
										placeholder='Chọn khóa học'
										showSearch
										optionFilterProp='children'
										filterOption={(input, option) =>
											(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
										}
										onChange={() => form.setFieldsValue({ section_id: undefined })}
									>
										{courses.map((course) => (
											<Option key={course.id} value={course.id}>
												{course.title}
											</Option>
										))}
									</Select>
									{/* <CourseSelect></CourseSelect> */}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Phần học' name='section_id' rules={[...rules.required]}>
									<Select
										placeholder='Chọn phần học'
										showSearch
										optionFilterProp='children'
										filterOption={(input, option) =>
											(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
										}
										disabled={!watchedCourseId}
									>
										{sections
											.filter((section) => String(section.course_id) === String(watchedCourseId))
											.map((section) => (
												<Option key={section.id} value={section.id}>
													{section.title}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[16, 0]}>
							<Col span={12}>
								<Form.Item label='Loại nội dung' name='content_type' rules={[...rules.required]}>
									<Select placeholder='Chọn loại nội dung'>
										<Option value='video'>Video</Option>
										<Option value='text'>Văn bản</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Thời lượng (phút)' name='duration_minutes' rules={[...rules.required]}>
									<InputNumber placeholder='Nhập thời lượng' style={{ width: '100%' }} min={1} max={9999} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[16, 0]}>
							<Col span={12}>
								<Form.Item label='Thứ tự' name='order_number' rules={[...rules.required]}>
									<InputNumber placeholder='Nhập thứ tự' style={{ width: '100%' }} min={1} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Mô tả bài học'
									name='description'
									rules={[{ max: 1000, message: 'Mô tả tối đa 1000 ký tự' }]}
								>
									<TextArea rows={4} placeholder='Nhập mô tả chi tiết về bài học' showCount maxLength={1000} />
								</Form.Item>
							</Col>
						</Row>
					</Card>
					{watchedContentType === 'video' && (
						<>
							<Card type='inner' title='📹 Thông tin video cơ bản' style={{ marginBottom: 16 }}>
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
											rules={[...rules.required, { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
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
											rules={[{ max: 5000, message: 'Mã nhúng tối đa 5000 ký tự' }]}
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
											rules={[{ max: 10000, message: 'Transcript tối đa 10000 ký tự' }]}
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
											rules={[{ max: 255, message: 'Khóa mã hóa tối đa 255 ký tự' }]}
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
						</>
					)}
					<Card type='inner' title='⚙️ Cài đặt' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={12}>
								<Form.Item label='Trạng thái' name='status' initialValue='pending'>
									<Select placeholder='Chọn trạng thái'>
										<Option value='pending'>Chờ duyệt</Option>
										<Option value='approved'>Đã duyệt</Option>
										<Option value='rejected'>Bị từ chối</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Xem trước miễn phí'
									name='is_free_preview'
									valuePropName='checked'
									initialValue={false}
								>
									<Switch checkedChildren='Có' unCheckedChildren='Không' />
								</Form.Item>
							</Col>
						</Row>
					</Card>
					<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
						<Space size='large'>
							<Button loading={submitting} htmlType='submit' type='primary' size='large'>
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

export default LessonForm;
