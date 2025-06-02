import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, message, Space } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;

interface CategoryFormProps {
	title?: string;
	hideFooter?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ title = 'danh mục', hideFooter, ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm, danhSach } = useModel('category');
	const [form] = Form.useForm();
	const intl = useIntl();
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

	const validateFormData = (values: any): string | null => {
		if (!values.name?.trim()) {
			return 'Vui lòng nhập tên danh mục';
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
				name: values.name?.trim(),
				description: values.description?.trim() || '',
				parent_category_id: values.parent_category_id || null,
			};

			let submitData: Category.IRecord;
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
				submitData = baseSubmitData as Category.IRecord;
				result = await postModel(submitData);
			}

			// Check if the operation was successful
			if (result) {
				message.success(`${edit ? 'Cập nhật' : 'Thêm mới'} danh mục thành công`);
				setVisibleForm(false);
				resetFieldsForm(form);
			} else {
				throw new Error('Operation failed');
			}
		} catch (error: any) {
			console.error('Form submission error:', error);
			const errorMessage =
				error?.response?.data?.message || error?.message || `${edit ? 'Cập nhật' : 'Thêm mới'} danh mục thất bại`;
			message.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setVisibleForm(false);
		resetFieldsForm(form);
	};

	// Get parent categories (exclude current category and its children when editing)
	const getParentCategoryOptions = () => {
		if (!danhSach) return [];

		let availableCategories = danhSach;

		// When editing, exclude current category to prevent circular reference
		if (edit && record?.id) {
			availableCategories = danhSach.filter((cat: Category.IRecord) => cat.id !== record.id);
		}

		return availableCategories;
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					{/* Thông tin cơ bản */}
					<Card type='inner' title='📋 Thông tin cơ bản' style={{ marginBottom: 16 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Tên danh mục'
									name='name'
									rules={[...rules.required, { max: 200, message: 'Tên danh mục tối đa 200 ký tự' }]}
								>
									<Input placeholder='Nhập tên danh mục' maxLength={200} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item label='Danh mục cha' name='parent_category_id'>
									<Select
										placeholder='Chọn danh mục cha (tùy chọn)'
										allowClear
										showSearch
										optionFilterProp='children'
										filterOption={(input, option) =>
											(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
										}
									>
										{getParentCategoryOptions().map((category: Category.IRecord) => (
											<Option key={category.id} value={category.id}>
												{category.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									label='Mô tả danh mục'
									name='description'
									rules={[{ max: 1000, message: 'Mô tả tối đa 1000 ký tự' }]}
								>
									<TextArea rows={4} placeholder='Nhập mô tả chi tiết về danh mục' showCount maxLength={1000} />
								</Form.Item>
							</Col>
						</Row>
					</Card>

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

export default CategoryForm;
