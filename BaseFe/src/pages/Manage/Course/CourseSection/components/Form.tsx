import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, message, Space, InputNumber } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;

interface CourseSectionFormProps {
	title?: string;
}

const CourseSectionForm: React.FC<CourseSectionFormProps> = ({ title = 'chương học', ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('course.courseSection');
	const { danhSach: courseList, getAllModel: getAllCourses } = useModel('course.courses');
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	// Load courses when component mounts
	useEffect(() => {
		getAllCourses();
	}, [getAllCourses]);

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

	const validateFormData = (values: any): string | null => {
		if (!values.title?.trim()) {
			return 'Vui lòng nhập tiêu đề chương';
		}

		if (!values.course_id) {
			return 'Vui lòng chọn khóa học';
		}

		if (!values.order_number || values.order_number < 1) {
			return 'Vui lòng nhập thứ tự hợp lệ (từ 1 trở lên)';
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
				title: values.title?.trim(),
				description: values.description?.trim() || '',
				course_id: values.course_id,
				order_number: values.order_number,
			};

			let submitData: CourseSection.IRecord;
			let result;

			if (edit) {
				// For editing: include all fields including IDs
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				submitData = {
					...baseSubmitData,
					id: record.id,
				};
				result = await putModel(record.id, submitData);
			} else {
				// For creating: only include necessary fields, no ID
				submitData = baseSubmitData as CourseSection.IRecord;
				result = await postModel(submitData);
			}

			// Check if the operation was successful
			if (result) {
				message.success(`${edit ? 'Cập nhật' : 'Thêm mới'} chương học thành công`);
				setVisibleForm(false);
				resetFieldsForm(form);
			} else {
				throw new Error('Operation failed');
			}
		} catch (error: any) {
			console.error('Form submission error:', error);
			const errorMessage =
				error?.response?.data?.message || error?.message || `${edit ? 'Cập nhật' : 'Thêm mới'} chương học thất bại`;
			message.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setVisibleForm(false);
		resetFieldsForm(form);
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					{/* Thông tin cơ bản */}
					<Card type='inner' title='📚 Thông tin cơ bản' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Tiêu đề chương'
									name='title'
									rules={[...rules.required, { max: 200, message: 'Tiêu đề chương tối đa 200 ký tự' }]}
								>
									<Input placeholder='Nhập tiêu đề chương' maxLength={200} />
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
									>
										{courseList?.map((course: any) => (
											<Option key={course.id} value={course.id}>
												{course.title || course.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Thứ tự'
									name='order_number'
									rules={[...rules.required, { type: 'number', min: 1, message: 'Thứ tự phải từ 1 trở lên' }]}
								>
									<InputNumber placeholder='Nhập thứ tự' min={1} style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Mô tả chương'
									name='description'
									rules={[{ max: 1000, message: 'Mô tả tối đa 1000 ký tự' }]}
								>
									<TextArea rows={4} placeholder='Nhập mô tả chi tiết về chương học' showCount maxLength={1000} />
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

export default CourseSectionForm;
