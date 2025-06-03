import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Spin, message, Button } from 'antd';
import {
	HomeOutlined,
	ReadOutlined,
	FileTextOutlined,
	PlusOutlined,
	CheckCircleOutlined,
	PlayCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'umi';

import Sidebar from '@/components/Siderbar';
import HeaderBaiHoc from '@/components/Header/HeaderBaiHoc';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Interfaces cho type safety
interface Course {
	id: string;
	course_code: string;
	title: string;
	description: string;
	price: number;
	instructor: string;
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
	prevent_skipping?: boolean;
	encryption_key?: string;
}

const BaiHocPage: React.FC = () => {
	// Lấy course ID và lesson ID từ URL params
	const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

	// State management
	const [course, setCourse] = useState<Course | null>(null);
	const [sections, setSections] = useState<CourseSection[]>([]);
	const [lessons, setLessons] = useState<{ [sectionId: string]: Lesson[] }>({});
	const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
	const [currentVideo, setCurrentVideo] = useState<VideoLesson | null>(null);
	const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

	// Dữ liệu điều hướng sidebar
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	// Toggle mở/đóng section
	const toggleExpand = async (sectionId: string) => {
		if (expandedLessons.includes(sectionId)) {
			setExpandedLessons(expandedLessons.filter((id) => id !== sectionId));
		} else {
			setExpandedLessons([...expandedLessons, sectionId]);

			// Fetch lessons cho section này nếu chưa load
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

	// Chuyển bài học
	const handleLessonClick = async (lesson: Lesson) => {
		setCurrentLesson(lesson);

		// Fetch video data cho bài học này
		try {
			const videoResponse = await axios.get<VideoLesson[]>(`http://localhost:3000/videoLessons?lesson_id=${lesson.id}`);
			if (videoResponse.data.length > 0) {
				const video = videoResponse.data[0];
				console.log('Fetched video lesson:', video); // Debug embed code
				setCurrentVideo(video);
			} else {
				setCurrentVideo(null);
			}
		} catch (error) {
			console.error('Error fetching video data:', error);
			message.error('Không thể tải video bài học');
		}
	};

	// Đánh dấu bài học hoàn thành
	const markLessonCompleted = (lessonId: string) => {
		setCompletedLessons((prev) => new Set([...prev, lessonId]));
		// Có thể gọi API để lưu trạng thái hoàn thành
		console.log('Lesson completed:', lessonId);
	};

	// Format thời lượng
	const formatDuration = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
		}
		return `${mins.toString().padStart(2, '0')}:00`;
	};

	// Load dữ liệu khóa học
	useEffect(() => {
		const fetchCourseData = async () => {
			if (!courseId) return;

			try {
				setLoading(true);

				// Fetch thông tin khóa học
				const courseResponse = await axios.get<Course>(`http://localhost:3000/courses/${courseId}`);
				setCourse(courseResponse.data);

				// Fetch các section của khóa học
				const sectionsResponse = await axios.get<CourseSection[]>(
					`http://localhost:3000/courseSections?course_id=${courseId}`,
				);
				const sortedSections = sectionsResponse.data.sort((a, b) => a.order_number - b.order_number);
				setSections(sortedSections);

				// Auto-expand section đầu tiên và load lessons
				if (sortedSections.length > 0) {
					const firstSectionId = sortedSections[0].id;
					setExpandedLessons([firstSectionId]);

					try {
						const lessonsResponse = await axios.get<Lesson[]>(
							`http://localhost:3000/lessons?section_id=${firstSectionId}`,
						);
						const sortedLessons = lessonsResponse.data.sort((a, b) => a.order_number - b.order_number);
						setLessons({
							[firstSectionId]: sortedLessons,
						});

						// Nếu có lessonId trong URL, tìm và set lesson đó
						if (lessonId) {
							const targetLesson = sortedLessons.find((lesson) => lesson.id === lessonId);
							if (targetLesson) {
								setCurrentLesson(targetLesson);
								// Load video cho lesson này
								const videoResponse = await axios.get<VideoLesson[]>(
									`http://localhost:3000/videoLessons?lesson_id=${lessonId}`,
								);
								if (videoResponse.data.length > 0) {
									const video = videoResponse.data[0];
									console.log('Fetched video for lessonId:', video); // Debug embed code
									setCurrentVideo(video);
								}
							}
						} else if (sortedLessons.length > 0) {
							// Nếu không có lessonId, chọn bài đầu tiên
							const firstLesson = sortedLessons[0];
							setCurrentLesson(firstLesson);
							const videoResponse = await axios.get<VideoLesson[]>(
								`http://localhost:3000/videoLessons?lesson_id=${firstLesson.id}`,
							);
							if (videoResponse.data.length > 0) {
								const video = videoResponse.data[0];
								console.log('Fetched video for first lesson:', video); // Debug embed code
								setCurrentVideo(video);
							}
						}
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
	}, [courseId, lessonId]);

	// Loading state
	if (loading) {
		return (
			<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
				<HeaderBaiHoc />
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
			</Layout>
		);
	}

	// Error state
	if (!course) {
		return (
			<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
				<HeaderBaiHoc />
				<div style={{ textAlign: 'center', padding: '100px 0' }}>
					<Title level={3}>Không tìm thấy khóa học</Title>
					<Button type='primary' onClick={() => window.history.back()}>
						Quay lại
					</Button>
				</div>
			</Layout>
		);
	}

	return (
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
			{/* Header */}
			<HeaderBaiHoc />

			{/* Sidebar */}
			<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} stickerOpacity={0.6} />

			{/* Nội dung chính */}
			<Layout style={{ backgroundColor: '#f5f5f5' }}>
				<Content>
					<Row gutter={[24, 24]}>
						{/* Nội dung bài học */}
						<Col xs={24} md={16} style={{ margin: '50px 0 16px' }}>
							{/* Video bài giảng */}
							<div
								style={{
									top: 70,
									zIndex: 10,
									marginBottom: '24px',
									textAlign: 'center',
									background: '#fff',
									borderRadius: '8px',
									boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
									marginTop: 0,
								}}
							>
								<div
									style={{
										aspectRatio: '16/9',
										width: '100%',
										height: 'auto',
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									{currentVideo && currentVideo.embed_code ? (
										<iframe
											src={currentVideo.embed_code.match(/src=["'](.*?)["']/i)?.[1] || currentVideo.video_url}
											title='Video lesson'
											frameBorder='0'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
											referrerPolicy='strict-origin-when-cross-origin'
											allowFullScreen
											style={{
												width: '100%',
												height: '100%',
												position: 'absolute',
												top: 0,
												left: 0,
												border: 'none',
											}}
										/>
									) : currentVideo && currentVideo.video_url ? (
										<video
											width='100%'
											height='100%'
											controls
											style={{
												width: '100%',
												height: '100%',
												position: 'absolute',
												top: 0,
												left: 0,
											}}
										>
											<source src={currentVideo.video_url} type='video/mp4' />
											Trình duyệt của bạn không hỗ trợ video.
										</video>
									) : (
										// Fallback video mẫu
										<iframe
											width='100%'
											height='100%'
											src='https://www.youtube.com/embed/ReQshHb5_RA?si=jpDABuQUV__ongS-'
											title='YouTube video player'
											frameBorder='0'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
											referrerPolicy='strict-origin-when-cross-origin'
											allowFullScreen
											style={{
												width: '100%',
												height: '100%',
												position: 'absolute',
												top: 0,
												left: 0,
												border: 'none',
											}}
										/>
									)}

									{!completedLessons.has(currentLesson?.id || '') && (
										<div
											style={{
												position: 'absolute',
												bottom: '10px',
												right: '10px',
												zIndex: 20,
											}}
										>
											<Button
												type='primary'
												icon={<CheckCircleOutlined />}
												onClick={() => currentLesson && markLessonCompleted(currentLesson.id)}
											>
												Hoàn thành
											</Button>
										</div>
									)}
								</div>
							</div>

							{/* Nội dung bài học */}
							<div style={{ margin: 28 }}>
								<Title level={2} style={{ margin: '0 0 16px', fontWeight: 'bold', color: '#f05123' }}>
									{currentLesson?.title || 'Chọn bài học để bắt đầu'}
								</Title>
								<Paragraph style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
									{course.title} - {course.instructor}
								</Paragraph>
								<Paragraph style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
									{currentLesson?.description || course.description}
								</Paragraph>

								{currentVideo?.transcript && (
									<div style={{ marginTop: '24px' }}>
										<Title level={4}>Nội dung bài học:</Title>
										<Paragraph style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
											{currentVideo.transcript}
										</Paragraph>
									</div>
								)}
							</div>
						</Col>

						{/* Sidebar nội dung khóa học */}
						<Col xs={24} md={8}>
							<div style={{ position: 'sticky', top: '70px' }}>
								<div
									style={{
										backgroundColor: '#fff',
										borderRadius: '8px',
										overflow: 'hidden',
										marginBottom: '16px',
										boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
									}}
								>
									<Title level={2} style={{ margin: '16px', fontWeight: '20px' }}>
										Nội dung khóa học
									</Title>
									<div style={{ margin: '0 16px 16px' }}>
										{sections.map((section) => (
											<div
												key={section.id}
												style={{
													marginBottom: '8px',
													backgroundColor: '#fff',
													borderRadius: '8px',
													overflow: 'hidden',
													border: '1px solid #f1f1f1',
												}}
											>
												{/* Section header */}
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
													<span style={{ display: 'flex', alignItems: 'center' }}>
														<span
															style={{
																marginRight: '12px',
																color: expandedLessons.includes(section.id) ? '#f05123' : '#666',
																transform: expandedLessons.includes(section.id) ? 'rotate(90deg)' : 'rotate(0deg)',
																transition: 'transform 0.3s ease',
															}}
														>
															<PlusOutlined />
														</span>
														<Text strong style={{ color: expandedLessons.includes(section.id) ? '#f05123' : '#333' }}>
															{section.order_number}. {section.title}
														</Text>
													</span>
													<Text style={{ color: '#666' }}>
														{lessons[section.id] ? lessons[section.id].length : '...'} bài học
													</Text>
												</div>

												{/* Lessons cho các section mở rộng */}
												{expandedLessons.includes(section.id) && lessons[section.id] && (
													<div>
														{lessons[section.id].map((lesson) => (
															<div
																key={lesson.id}
																style={{
																	padding: '12px 16px 12px 48px',
																	display: 'flex',
																	justifyContent: 'space-between',
																	alignItems: 'center',
																	borderTop: '1px solid #f1f1f1',
																	backgroundColor: currentLesson?.id === lesson.id ? '#fff3ef' : '#fff',
																	cursor: 'pointer',
																}}
																onClick={() => handleLessonClick(lesson)}
															>
																<div
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		color: currentLesson?.id === lesson.id ? '#f05123' : '#333',
																	}}
																>
																	<span
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
																		{completedLessons.has(lesson.id) ? (
																			<CheckCircleOutlined style={{ color: '#4caf50' }} />
																		) : (
																			<span
																				style={{
																					width: '16px',
																					height: '16px',
																					borderRadius: '50%',
																					border: '2px solid #d3d3d3',
																					backgroundColor: currentLesson?.id === lesson.id ? '#f05123' : 'transparent',
																					position: 'relative',
																				}}
																			>
																				{currentLesson?.id === lesson.id && (
																					<span
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
																			</span>
																		)}
																	</span>
																	<div>
																		<Text style={{ color: currentLesson?.id === lesson.id ? '#f05123' : '#333' }}>
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
							</div>
						</Col>
					</Row>
				</Content>
			</Layout>
		</Layout>
	);
};

export default BaiHocPage;
