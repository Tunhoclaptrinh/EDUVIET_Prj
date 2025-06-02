import React, { useState, useEffect } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Row,
	Select,
	Switch,
	DatePicker,
	message,
	Space,
	InputNumber,
	Image,
} from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios';
import CourseSelect from './Select';

const { Option } = Select;
const { TextArea } = Input;

interface CourseFormProps {
	title?: string;
	hideFooter?: boolean;
}

interface Category {
	id: number;
	name: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ title = 'khóa học', hideFooter, ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('course.courses');
	const [form] = Form.useForm();
	const intl = useIntl();
	const [submitting, setSubmitting] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [imageUrl, setImageUrl] = useState<string>('');

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoadingCategories(true);
				const response = await axios.get<Category[]>('http://localhost:3000/categories');
				setCategories(response.data || []);
			} catch (error) {
				console.error('Error fetching categories:', error);
				message.error('Không thể tải danh sách danh mục');
				setCategories([]);
			} finally {
				setLoadingCategories(false);
			}
		};

		if (visibleForm) {
			fetchCategories();
		}
	}, [visibleForm]);

	// Reset form and populate data when opening
	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setImageUrl('');
		} else if (record?.id) {
			const formData = {
				...record,
				published_at: record.published_at ? moment(record.published_at) : null,
			};
			form.setFieldsValue(formData);
			setImageUrl(record.thumbnail || '');
		}
	}, [record?.id, visibleForm, form]);

	const validateFormData = (values: any): string | null => {
		if (!values.course_code?.trim()) {
			return 'Vui lòng nhập mã khóa học';
		}

		if (!values.title?.trim()) {
			return 'Vui lòng nhập tên khóa học';
		}

		if (!values.category_id) {
			return 'Vui lòng chọn danh mục';
		}

		if (!values.instructor?.trim()) {
			return 'Vui lòng nhập tên giảng viên';
		}

		if (values.price === undefined || values.price === null || values.price < 0) {
			return 'Vui lòng nhập giá hợp lệ';
		}

		if (values.commission_rate !== undefined && values.commission_rate !== null) {
			if (values.commission_rate < 0 || values.commission_rate > 1) {
				return 'Tỷ lệ hoa hồng phải từ 0 đến 1';
			}
		}

		if (values.max_learners !== undefined && values.max_learners !== null && values.max_learners < 1) {
			return 'Số người học tối đa phải lớn hơn 0';
		}

		if (
			values.certification_price !== undefined &&
			values.certification_price !== null &&
			values.certification_price < 0
		) {
			return 'Giá chứng chỉ phải lớn hơn hoặc bằng 0';
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
				course_code: values.course_code?.trim(),
				title: values.title?.trim(),
				description: values.description?.trim() || '',
				published_at: values.published_at ? values.published_at.format('YYYY-MM-DD') : null,
				price: Number(values.price) || 0,
				category_id: values.category_id,
				instructor: values.instructor?.trim(),
				max_learners: Number(values.max_learners) || 0,
				commission_rate: Number(values.commission_rate) || 0,
				has_certification: Boolean(values.has_certification),
				certification_price: values.certification_price ? Number(values.certification_price) : undefined,
				status: values.status || 'pending_approval',
				thumbnail: values.thumbnail?.trim() || imageUrl || '',
			};

			let submitData: Course.IRecord;
			let result;

			if (edit) {
				// For editing: include all fields including IDs and metadata
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				submitData = {
					...baseSubmitData,
					id: record.id,
					created_at: record.created_at || '',
					updated_at: record.updated_at || '',
					enrolled_count: record.enrolled_count || 0,
					avg_rating: record.avg_rating || null,
				};
				result = await putModel(record.id, submitData);
			} else {
				// For creating: only include necessary fields, no ID or metadata
				submitData = baseSubmitData as Course.IRecord;
				result = await postModel(submitData);
			}

			// Check if the operation was successful
			if (result) {
				message.success(`${edit ? 'Cập nhật' : 'Thêm mới'} khóa học thành công`);
				setVisibleForm(false);
				resetFieldsForm(form);
				setImageUrl('');
			} else {
				throw new Error('Operation failed');
			}
		} catch (error: any) {
			console.error('Form submission error:', error);
			const errorMessage =
				error?.response?.data?.message || error?.message || `${edit ? 'Cập nhật' : 'Thêm mới'} khóa học thất bại`;
			message.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setVisibleForm(false);
		resetFieldsForm(form);
		setImageUrl('');
	};

	const formatPrice = (value: string | number | undefined): string => {
		if (!value) return '';
		return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const parsePrice = (value: string | undefined): string => {
		if (!value) return '';
		return value.replace(/\$\s?|(,*)/g, '');
	};

	const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const url = e.target.value;
		setImageUrl(url);
		form.setFieldsValue({ thumbnail: url });
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					{/* Thông tin cơ bản */}
					<Card type='inner' title='📋 Thông tin cơ bản' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24} md={8}>
								<Form.Item
									label='Mã khóa học'
									name='course_code'
									rules={[
										...rules.required,
										{ max: 20, message: 'Mã khóa học tối đa 20 ký tự' },
										{ pattern: /^[A-Z0-9_-]+$/, message: 'Mã chỉ chứa chữ hoa, số, gạch dưới và gạch ngang' },
									]}
								>
									<Input
										placeholder='Nhập mã khóa học (VD: WEB001)'
										style={{ textTransform: 'uppercase' }}
										maxLength={20}
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={16}>
								<Form.Item
									label='Tên khóa học'
									name='title'
									rules={[...rules.required, { max: 200, message: 'Tên khóa học tối đa 200 ký tự' }]}
								>
									<Input placeholder='Nhập tên khóa học đầy đủ' maxLength={200} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Mô tả khóa học'
									name='description'
									rules={[{ max: 2000, message: 'Mô tả tối đa 2000 ký tự' }]}
								>
									<TextArea
										rows={4}
										placeholder='Nhập mô tả chi tiết về khóa học, nội dung, lợi ích và những gì học viên sẽ đạt được'
										showCount
										maxLength={2000}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Phân loại và giảng viên */}
					<Card type='inner' title='👨‍🏫 Phân loại và giảng viên' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24} md={8}>
								<Form.Item label='Danh mục' name='category_id' rules={[...rules.required]}>
									<Select
										placeholder='Chọn danh mục'
										loading={loadingCategories}
										showSearch
										optionFilterProp='children'
										filterOption={(input, option) =>
											(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
										}
									>
										{categories.map((category) => (
											<Option key={category.id} value={category.id}>
												{category.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									label='Tên giảng viên'
									name='instructor'
									rules={[...rules.required, { max: 100, message: 'Tên giảng viên tối đa 100 ký tự' }]}
								>
									<Input placeholder='Nhập tên đầy đủ của giảng viên' maxLength={100} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item label='Trạng thái' name='status' rules={[...rules.required]}>
									<Select placeholder='Chọn trạng thái'>
										<Option value='pending_approval'>Chờ duyệt</Option>
										<Option value='approved'>Đã duyệt</Option>
										<Option value='rejected'>Từ chối</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Thông tin giá cả */}
					<Card type='inner' title='💰 Thông tin giá cả' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24} md={8}>
								<Form.Item
									label='Giá khóa học (VND)'
									name='price'
									rules={[...rules.required, { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0' }]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Nhập giá khóa học'
										formatter={formatPrice}
										parser={parsePrice}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									label='Tỷ lệ hoa hồng (0-1)'
									name='commission_rate'
									rules={[...rules.required, { type: 'number', min: 0, max: 1, message: 'Tỷ lệ hoa hồng từ 0 đến 1' }]}
								>
									<InputNumber style={{ width: '100%' }} step={0.01} min={0} max={1} placeholder='VD: 0.1 (10%)' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									label='Giá chứng chỉ (VND)'
									name='certification_price'
									rules={[{ type: 'number', min: 0, message: 'Giá chứng chỉ phải lớn hơn hoặc bằng 0' }]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Nhập giá chứng chỉ (tùy chọn)'
										formatter={formatPrice}
										parser={parsePrice}
										min={0}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Cài đặt khóa học */}
					<Card type='inner' title='⚙️ Cài đặt khóa học' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 16]}>
							<Col span={24} md={8}>
								<Form.Item
									label='Số lượng học viên tối đa'
									name='max_learners'
									rules={[...rules.required, { type: 'number', min: 1, message: 'Số lượng học viên phải lớn hơn 0' }]}
								>
									<InputNumber style={{ width: '100%' }} placeholder='VD: 100' min={1} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item label='Có cấp chứng chỉ' name='has_certification' valuePropName='checked'>
									<Switch checkedChildren='Có' unCheckedChildren='Không' style={{ marginTop: 4 }} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item label='Ngày phát hành' name='published_at'>
									<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày phát hành' format='DD/MM/YYYY' />
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Hình ảnh và media */}
					<Card type='inner' title='🖼️ Hình ảnh đại diện' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24} md={16}>
								<Form.Item
									label='URL hình ảnh thumbnail'
									name='thumbnail'
									rules={[
										{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' },
										{ max: 500, message: 'URL quá dài' },
									]}
								>
									<Input placeholder='https://example.com/image.jpg' onChange={handleImageUrlChange} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item label='Xem trước'>
									{imageUrl ? (
										<Image
											src={imageUrl}
											alt='Course thumbnail preview'
											width={120}
											height={80}
											style={{
												objectFit: 'cover',
												borderRadius: '8px',
												border: '1px solid #d9d9d9',
											}}
											fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L'
										/>
									) : (
										<div
											style={{
												width: 120,
												height: 80,
												border: '2px dashed #d9d9d9',
												borderRadius: '8px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												color: '#999',
												fontSize: '12px',
											}}
										>
											Chưa có ảnh
										</div>
									)}
								</Form.Item>
							</Col>
						</Row>
					</Card>

					{/* Thông tin chỉ đọc (khi edit) */}
					{edit && record && (
						<Card type='inner' title='📊 Thông tin thống kê' style={{ marginBottom: 16 }}>
							<Row gutter={[16, 0]}>
								<Col span={24} md={8}>
									<Form.Item label='Số lượng đã đăng ký'>
										<InputNumber
											style={{ width: '100%' }}
											value={record.enrolled_count || 0}
											disabled
											formatter={(value) => `${value || 0} học viên`}
										/>
									</Form.Item>
								</Col>
								<Col span={24} md={8}>
									<Form.Item label='Đánh giá trung bình'>
										<InputNumber
											style={{ width: '100%' }}
											value={record.avg_rating || 0}
											disabled
											formatter={(value) => (value ? `${value} ⭐` : 'Chưa có đánh giá')}
										/>
									</Form.Item>
								</Col>
								<Col span={24} md={8}>
									<Form.Item label='Ngày tạo'>
										<Input
											value={record.created_at ? moment(record.created_at).format('DD/MM/YYYY HH:mm') : ''}
											disabled
										/>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					)}

					{!hideFooter && (
						<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
							<Space size='large'>
								<Button loading={submitting} htmlType='submit' type='primary' size='large'>
									{edit
										? intl.formatMessage({ id: 'global.button.luulai' })
										: intl.formatMessage({ id: 'global.button.themmoi' })}
								</Button>
								<Button onClick={handleCancel} size='large'>
									{intl.formatMessage({ id: 'global.button.huy' })}
								</Button>
							</Space>
						</div>
					)}
				</Form>
			</Card>
		</div>
	);
};

export default CourseForm;
