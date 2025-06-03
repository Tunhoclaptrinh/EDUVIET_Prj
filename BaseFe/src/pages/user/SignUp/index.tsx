import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, Checkbox, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useIntl, Link, useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import styles from './index.less';

const SignUp: React.FC = () => {
	const { dangKy } = useModel('users');
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();
	const intl = useIntl();

	const handleSubmit = async (values: any) => {
		try {
			if (values.password !== values.confirmPassword) {
				message.error(
					intl.formatMessage({
						id: 'signup.passwordMismatch',
						defaultMessage: 'Mật khẩu và xác nhận mật khẩu không khớp',
					}),
				);
				return;
			}
			setSubmitting(true);
			const payload = {
				email: values.email,
				fullName: `${values.ho} ${values.ten}`,
				soDT: values.soDT,
				ngaySinh: values.ngaySinh,
				password: values.password,
			};
			await dangKy(payload);
			message.success(intl.formatMessage({ id: 'signup.success', defaultMessage: 'Đăng ký thành công!' }));
		} catch (error) {
			message.error(intl.formatMessage({ id: 'signup.error', defaultMessage: 'Đăng ký tài khoản thất bại' }));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.top}>
					<div className={styles.header}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img alt='logo' className={styles.logo} src='/logo-full.svg' />
						</div>
					</div>
				</div>

				<div className={styles.main}>
					<span
						style={{ fontWeight: 600, color: '#000', marginBottom: 30, textAlign: 'center' }}
						className={styles.desc}
					>
						{intl.formatMessage({ id: 'signup.title', defaultMessage: 'Đăng ký tài khoản mới' })}
					</span>
					<Form form={form} onFinish={handleSubmit} layout='vertical' style={{ marginTop: 10 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									name='email'
									label={intl.formatMessage({ id: 'signup.email', defaultMessage: 'Email' })}
									rules={[...rules.required, ...rules.email]}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'signup.email.placeholder',
											defaultMessage: 'Nhập địa chỉ email',
										})}
										prefix={<MailOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item
									name='ho'
									label={intl.formatMessage({ id: 'signup.firstName', defaultMessage: 'Họ và tên đệm' })}
									rules={[...rules.required]}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'signup.firstName.placeholder',
											defaultMessage: 'Nhập họ và tên riêng',
										})}
										prefix={<UserOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item
									name='ten'
									label={intl.formatMessage({ id: 'signup.lastName', defaultMessage: 'Tên' })}
									rules={[...rules.required]}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'signup.lastName.placeholder',
											defaultMessage: 'Nhập tên của bạn',
										})}
										prefix={<UserOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='password'
									label={intl.formatMessage({ id: 'signup.password', defaultMessage: 'Mật khẩu' })}
									rules={[...rules.required, ...rules.password]}
								>
									<Input.Password
										placeholder={intl.formatMessage({
											id: 'signup.password.placeholder',
											defaultMessage: 'Nhập mật khẩu',
										})}
										prefix={<LockOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='confirmPassword'
									label={intl.formatMessage({ id: 'signup.confirmPassword', defaultMessage: 'Xác nhận mật khẩu' })}
									rules={[
										...rules.required,
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}
												return Promise.reject(
													new Error(
														intl.formatMessage({
															id: 'signup.passwordMismatch',
															defaultMessage: 'Mật khẩu không khớp',
														}),
													),
												);
											},
										}),
									]}
								>
									<Input.Password
										placeholder={intl.formatMessage({
											id: 'signup.confirmPassword.placeholder',
											defaultMessage: 'Nhập lại mật khẩu',
										})}
										prefix={<LockOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={24}>
								<Form.Item
									name='soDT'
									label={intl.formatMessage({ id: 'signup.phone', defaultMessage: 'Số điện thoại' })}
									// rules={[...rules.required]}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'signup.phone.placeholder',
											defaultMessage: 'Nhập số điện thoại',
										})}
										prefix={<PhoneOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>
							{/* 
							<Col span={24} md={12}>
								<Form.Item
									name='ngaySinh'
									label={intl.formatMessage({ id: 'signup.birthDate', defaultMessage: 'Ngày sinh' })}
								>
									<MyDatePicker
										placeholder={intl.formatMessage({
											id: 'signup.birthDate.placeholder',
											defaultMessage: 'Chọn ngày sinh',
										})}
										format='DD/MM/YYYY'
										style={{ width: '100%' }}
										size='large'
									/>
								</Form.Item>
							</Col> */}

							<Col span={24}>
								<Form.Item
									name='terms'
									valuePropName='checked'
									rules={[
										{
											validator: (_, value) =>
												value
													? Promise.resolve()
													: Promise.reject(
															new Error(
																intl.formatMessage({
																	id: 'signup.terms.required',
																	defaultMessage: 'Bạn phải đồng ý với điều khoản sử dụng',
																}),
															),
													  ),
										},
									]}
								>
									<Checkbox>
										{intl.formatMessage({ id: 'signup.terms', defaultMessage: 'Tôi đã đọc và đồng ý với ' })}
										<a href='#' target='_blank'>
											{intl.formatMessage({ id: 'signup.terms.link', defaultMessage: 'điều khoản sử dụng' })}
										</a>
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item>
							<Button type='primary' htmlType='submit' block size='large' loading={submitting}>
								{intl.formatMessage({ id: 'signup.submit', defaultMessage: 'Đăng ký' })}
							</Button>
						</Form.Item>
					</Form>

					<div style={{ textAlign: 'center', marginTop: 16 }}>
						{intl.formatMessage({ id: 'signup.hasAccount', defaultMessage: 'Đã có tài khoản?' })}{' '}
						<Link to='/user/login'>{intl.formatMessage({ id: 'signup.login', defaultMessage: 'Đăng nhập ngay' })}</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
