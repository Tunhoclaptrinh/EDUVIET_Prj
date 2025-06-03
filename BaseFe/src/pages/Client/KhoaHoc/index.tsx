import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Spin, message } from 'antd';
import {
	HomeOutlined,
	ReadOutlined,
	FileTextOutlined,
	PlayCircleOutlined,
	CheckCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useParams, useHistory } from 'umi';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/Siderbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Content } from 'antd/lib/layout/layout';

const { Title, Paragraph, Text } = Typography;

// Interfaces for type safety
interface Course {
	id: string;
	course_code: string;
	title: string;
	description: string;
	price: number;
	instructor_id: number;
	category_id: number;
	thumbnail: string;
	status: string;
	enrolled_count: number;
	avg_rating: number;
	has_certification: boolean;
	certification_price?: number;
}

interface CourseSection {
	id: string;
	course_id: number;
	title: string;
	description: string;
	order_number: number;
}

interface Lesson {
	id: string;
	section_id: number;
	title: string;
	description: string;
	content_type: string;
	duration_minutes: number;
	order_number: number;
	is_free_preview: boolean;
	status: string;
}

interface VideoLesson {
	id: string;
	lesson_id: number;
	video_url: string;
	embed_code?: string;
	transcript?: string;
}

const KhoaHocPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const { user, isAuthenticated } = useAuth();

	// State management
	const [course, setCourse] = useState<Course | null>(null);
	const [sections, setSections] = useState<CourseSection[]>([]);
	const [lessons, setLessons] = useState<{ [sectionId: string]: Lesson[] }>({});
	const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isRegistered, setIsRegistered] = useState<boolean>(false);
	const [checkingEnrollment, setCheckingEnrollment] = useState<boolean>(true);

	// Navigation items
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	// Check enrollment status
	useEffect(() => {
		const checkEnrollment = async () => {
			if (!id || !user?.id) {
				setCheckingEnrollment(false);
				return;
			}

			try {
				const response = await axios.get(`http://localhost:3000/enrollments?user_id=${user.id}&course_id=${id}`);
				const enrollments = response.data;
				const isEnrolled = enrollments.length > 0 && enrollments[0].is_active;
				setIsRegistered(isEnrolled);
			} catch (error) {
				console.error('Error checking enrollment:', error);
				message.error('Không thể kiểm tra trạng thái đăng ký');
			} finally {
				setCheckingEnrollment(false);
			}
		};

		checkEnrollment();
	}, [id, user]);

	// Toggle section expansion
	const toggleExpand = async (sectionId: string) => {
		if (expandedLessons.includes(sectionId)) {
			setExpandedLessons(expandedLessons.filter((id) => id !== sectionId));
		} else {
			setExpandedLessons([...expandedLessons, sectionId]);

			if (!lessons[sectionId]) {
				try {
					const response = await axios.get<Lesson[]>(`http://localhost:3000/lessons?section_id=${sectionId}`);
					setLessons((prev) => ({
						...prev,
						[sectionId]: response.data.sort((a, b) => a.order_number - b.order_number),
					}));
				} catch (error) {
					console.error('Error fetching lessons:', error);
					message.error('Không thể tải danh sách bài học');
				}
			}
		}
	};

	// Fetch course data
	useEffect(() => {
		const fetchCourseData = async () => {
			if (!id) return;

			try {
				setLoading(true);

				// Fetch course details
				const courseResponse = await axios.get<Course>(`http://localhost:3000/courses/${id}`);
				setCourse(courseResponse.data);

				// Fetch course sections
				const sectionsResponse = await axios.get<CourseSection[]>(
					`http://localhost:3000/courseSections?course_id=${id}`,
				);
				const sortedSections = sectionsResponse.data.sort((a, b) => a.order_number - b.order_number);
				setSections(sortedSections);

				// Auto-expand first section
				if (sortedSections.length > 0) {
					const firstSectionId = sortedSections[0].id;
					setExpandedLessons([firstSectionId]);

					try {
						const lessonsResponse = await axios.get<Lesson[]>(
							`http://localhost:3000/lessons?section_id=${firstSectionId}`,
						);
						setLessons({
							[firstSectionId]: lessonsResponse.data.sort((a, b) => a.order_number - b.order_number),
						});
					} catch (error) {
						console.error('Error fetching first section lessons:', error);
					}
				}
			} catch (error) {
				console.error('Error fetching course data:', error);
				message.error('Không thể tải thông tin khóa học');
			} finally {
				setLoading(false);
			}
		};

		fetchCourseData();
	}, [id]);

	// Handle registration
	const handleRegistration = async () => {
		if (!isAuthenticated) {
			history.push(`/login?redirectTo=/courses/${id}`);
			message.warning('Vui lòng đăng nhập để đăng ký khóa học');
			return;
		}

		try {
			const enrollmentData = {
				user_id: parseInt(user!.id),
				course_id: parseInt(id!),
				enrollment_date: new Date().toISOString(),
				is_active: true,
				last_accessed: new Date().toISOString(),
				completion_percentage: 0,
				expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
				status: 'active',
			};

			const response = await axios.post('http://localhost:3000/enrollments', enrollmentData);
			if (response.status === 201) {
				setIsRegistered(true);
				message.success('Đăng ký khóa học thành công!');
			}
		} catch (error) {
			console.error('Error registering for course:', error);
			message.error('Đăng ký khóa học thất bại. Vui lòng thử lại.');
		}
	};

	// Handle "Vào học ngay" click
	const handleStartLearning = () => {
		const firstSectionId = sections[0]?.id;
		const firstLessonId = lessons[firstSectionId]?.[0]?.id;
		const redirectPath = firstLessonId ? `/public/khoa-hoc/${id}/bai-hoc/${firstLessonId}` : `/public/${id}/lessons`;
		history.push(redirectPath);
	};

	// Helper functions
	const formatPrice = (price: number): string => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

	const formatDuration = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
		}
		return `${mins.toString().padStart(2, '0')}:00`;
	};

	const getTotalStats = () => {
		const totalLessons = Object.values(lessons).reduce((sum, sectionLessons) => sum + sectionLessons.length, 0);
		const totalDuration = Object.values(lessons).reduce(
			(sum, sectionLessons) =>
				sum + sectionLessons.reduce((sectionSum, lesson) => sectionSum + lesson.duration_minutes, 0),
			0,
		);

		return {
			chapters: sections.length,
			lessons: totalLessons,
			duration: Math.floor(totalDuration / 60) + ' giờ ' + (totalDuration % 60) + ' phút',
		};
	};

	const courseFeatures = course
		? [
				{
					icon: <CheckCircleOutlined />,
					text: course.price === 0 ? 'Trình độ cơ bản' : 'Khóa học chất lượng cao',
				},
				{ icon: <CheckCircleOutlined />, text: `Tổng số ${getTotalStats().lessons} bài học` },
				{ icon: <CheckCircleOutlined />, text: `Thời lượng ${getTotalStats().duration}` },
				{ icon: <CheckCircleOutlined />, text: 'Học mọi lúc, mọi nơi' },
				...(course.has_certification ? [{ icon: <CheckCircleOutlined />, text: 'Có chứng chỉ hoàn thành' }] : []),
		  ]
		: [];

	// Loading state
	if (loading || checkingEnrollment) {
		return (
			<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
				<Header />
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '400px',
					}}
				>
					<Spin size='large' />
				</div>
				<Footer />
			</Layout>
		);
	}

	// Error state
	if (!course) {
		return (
			<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
				<Header />
				<div style={{ textAlign: 'center', padding: '100px 0' }}>
					<Title level={3}>Không tìm thấy khóa học</Title>
					<Button type='primary' onClick={() => window.history.back()}>
						Quay lại
					</Button>
				</div>
				<Footer />
			</Layout>
		);
	}

	return (
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
			<Header />
			<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} />

			<Layout style={{ backgroundColor: '#f5f5f5', margin: '120px 120px 60px' }}>
				<Content>
					<Row gutter={[24, 24]}>
						<Col xs={24} md={16}>
							<Title level={2} style={{ margin: '0 0 16px', fontWeight: 'bold' }}>
								{course.title}
							</Title>
							<Paragraph style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
								{course.description}
							</Paragraph>

							<div style={{ marginBottom: '24px' }}>
								<Title level={4} style={{ fontWeight: 'bold', margin: '0 0 16px' }}>
									Nội dung khóa học
								</Title>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '16px',
									}}
								>
									<div>
										<Text>
											{getTotalStats().chapters} chương • {getTotalStats().lessons} bài học • Thời lượng{' '}
											{getTotalStats().duration}
										</Text>
									</div>
									<Button
										type='link'
										style={{ color: '#f05123' }}
										onClick={() => {
											if (expandedLessons.length === sections.length) {
												setExpandedLessons([]);
											} else {
												setExpandedLessons(sections.map((s) => s.id));
											}
										}}
									>
										{expandedLessons.length === sections.length ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
									</Button>
								</div>

								<div>
									{sections.map((section, sectionIndex) => (
										<div
											key={section.id}
											style={{
												marginBottom: '8px',
												backgroundColor: '#fff',
												borderRadius: '8px',
												overflow: 'hidden',
											}}
										>
											<div
												style={{
													padding: '12px 16px',
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													cursor: 'pointer',
													borderLeft: expandedLessons.includes(section.id)
														? '4px solid #f05123'
														: '4px solid transparent',
												}}
												onClick={() => toggleExpand(section.id)}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<div
														style={{
															marginRight: '12px',
															color: expandedLessons.includes(section.id) ? '#f05123' : '#666',
															transform: expandedLessons.includes(section.id) ? 'rotate(90deg)' : 'rotate(0deg)',
															transition: 'transform 0.3s ease',
														}}
													>
														<PlusOutlined />
													</div>
													<Text strong style={{ color: expandedLessons.includes(section.id) ? '#f05123' : '#333' }}>
														{section.order_number}. {section.title}
													</Text>
												</div>
												<Text style={{ color: '#666' }}>
													{lessons[section.id] ? lessons[section.id].length : '...'} bài học
												</Text>
											</div>

											{expandedLessons.includes(section.id) && lessons[section.id] && (
												<div>
													{lessons[section.id].map((lesson, lessonIndex) => (
														<div
															key={lesson.id}
															style={{
																padding: '12px 16px 12px 48px',
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																borderTop: '1px solid #f1f1f1',
																backgroundColor: lessonIndex === 0 && sectionIndex === 0 ? '#fff3ef' : '#fff',
																cursor: 'pointer',
															}}
														>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	color: lessonIndex === 0 && sectionIndex === 0 ? '#f05123' : '#333',
																}}
															>
																<div
																	style={{
																		marginRight: '12px',
																		width: '20px',
																		height: '20px',
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'center',
																		fontSize: '12px',
																	}}
																>
																	<div
																		style={{
																			width: '16px',
																			height: '16px',
																			borderRadius: '50%',
																			border: '2px solid #d3d3d3',
																			backgroundColor:
																				lessonIndex === 0 && sectionIndex === 0 ? '#f05123' : 'transparent',
																			position: 'relative',
																		}}
																	>
																		{lessonIndex === 0 && sectionIndex === 0 && (
																			<div
																				style={{
																					position: 'absolute',
																					top: '3px',
																					left: '3px',
																					width: '6px',
																					height: '6px',
																					borderRadius: '50%',
																					backgroundColor: '#fff',
																				}}
																			/>
																		)}
																	</div>
																</div>
																<div>
																	<Text style={{ color: lessonIndex === 0 && sectionIndex === 0 ? '#f05123' : '#333' }}>
																		{lesson.order_number}. {lesson.title}
																	</Text>
																	{lesson.is_free_preview && (
																		<div style={{ fontSize: '10px', color: '#52c41a', marginTop: '2px' }}>
																			Miễn phí xem trước
																		</div>
																	)}
																</div>
															</div>
															<Text style={{ color: '#666' }}>{formatDuration(lesson.duration_minutes)}</Text>
														</div>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</Col>

						<Col xs={24} md={8}>
							<div style={{ position: 'sticky', top: '88px' }}>
								<div
									style={{
										backgroundColor: '#fff',
										borderRadius: '8px',
										overflow: 'hidden',
										marginBottom: '16px',
										boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
									}}
								>
									<div style={{ position: 'relative' }}>
										<div
											style={{
												background: 'linear-gradient(90deg, #009CDD, #22B6F1)',
												height: '200px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative',
												backgroundImage: `url(${course.thumbnail})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
											}}
										>
											<div
												style={{
													width: '100px',
													height: '100px',
													backgroundColor: 'rgba(0,0,0,0.4)',
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													cursor: 'pointer',
												}}
											>
												<PlayCircleOutlined style={{ fontSize: '40px', color: '#fff' }} />
											</div>
										</div>

										<div style={{ padding: '24px 20px', textAlign: 'center' }}>
											<Title level={4} style={{ fontWeight: 'bold', margin: '0 0 16px' }}>
												Xem giới thiệu khóa học
											</Title>

											<div
												style={{
													backgroundColor: course.price === 0 ? '#EAF5FE' : '#FFF3EF',
													color: course.price === 0 ? '#1677ff' : '#f05123',
													padding: '4px 12px',
													borderRadius: '4px',
													display: 'inline-block',
													fontWeight: 'bold',
													fontSize: '20px',
													margin: '0 0 16px',
												}}
											>
												{course.price === 0 ? 'Miễn phí' : formatPrice(course.price)}
											</div>

											{course.has_certification && course.certification_price && (
												<div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
													Chứng chỉ: {formatPrice(course.certification_price)}
												</div>
											)}

											<Button
												type='primary'
												size='large'
												block
												style={{
													backgroundColor: isRegistered ? '#52c41a' : '#1677ff',
													height: '40px',
													fontWeight: 'bold',
												}}
												onClick={isRegistered ? handleStartLearning : handleRegistration}
												loading={checkingEnrollment}
											>
												{isRegistered ? 'VÀO HỌC NGAY' : 'ĐĂNG KÝ HỌC'}
											</Button>
										</div>
									</div>
								</div>

								<div
									style={{
										backgroundColor: '#fff',
										borderRadius: '8px',
										overflow: 'hidden',
										padding: '16px',
										boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
									}}
								>
									{courseFeatures.map((feature, index) => (
										<div
											key={index}
											style={{
												display: 'flex',
												alignItems: 'center',
												padding: '8px 0',
												borderBottom: index < courseFeatures.length - 1 ? '1px solid #f1f1f1' : 'none',
											}}
										>
											<span style={{ marginRight: '10px', color: '#52c41a' }}>{feature.icon}</span>
											<span>{feature.text}</span>
										</div>
									))}

									<div style={{ marginTop: '16px', padding: '12px 0', borderTop: '1px solid #f1f1f1' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
											<Text style={{ color: '#666' }}>Số học viên:</Text>
											<Text strong>{course.enrolled_count}</Text>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
											<Text style={{ color: '#666' }}>Đánh giá:</Text>
											<Text strong>{course.avg_rating}/5 ⭐</Text>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<Text style={{ color: '#666' }}></Text>
											<strong>Mã khóa học:</strong>
											<Text strong>{course.course_code}</Text>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Content>
			</Layout>
			<Footer />
		</Layout>
	);
};

export default KhoaHocPage;
