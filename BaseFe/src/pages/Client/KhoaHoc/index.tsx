import { Layout, Typography, Button, Row, Col } from 'antd';
import {
	HomeOutlined,
	ReadOutlined,
	FileTextOutlined,
	PlayCircleOutlined,
	CheckCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Sidebar from '@/components/Siderbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Content } from 'antd/lib/layout/layout';

const { Title, Paragraph, Text } = Typography;

const KhoaHocPage = () => {
	// State to track expanded lessons
	const [expandedLessons, setExpandedLessons] = useState([1]);

	const toggleExpand = (lessonId: number) => {
		if (expandedLessons.includes(lessonId)) {
			setExpandedLessons(expandedLessons.filter((id) => id !== lessonId));
		} else {
			setExpandedLessons([...expandedLessons, lessonId]);
		}
	};

	// Course data
	const courseData = {
		title: 'Lập trình C++ cơ bản, nâng cao',
		description:
			'Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khai niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chính phục con đường trở thành một lập trình viên.',
		chapters: 11,
		lessons: 138,
		duration: '10 giờ 29 phút',
		type: 'Miễn phí',
		isRegistered: false,
	};

	// Lessons data
	const lessonsList = [
		{
			id: 1,
			title: 'Giới thiệu',
			expanded: true,
			lessons: [
				{ id: 1, title: 'Giới thiệu khóa học', duration: '01:03', completed: false },
				{ id: 2, title: 'Cài đặt Dev - C++', duration: '02:31', completed: false },
				{ id: 3, title: 'Hướng dẫn sử dụng Dev - C++', duration: '03:33', completed: false },
			],
			lessonCount: 3,
		},
		{
			id: 2,
			title: 'Biến và kiểu dữ liệu',
			expanded: false,
			lessons: [],
			lessonCount: 32,
		},
		{
			id: 3,
			title: 'Cấu trúc điều khiển và vòng lặp',
			expanded: false,
			lessons: [],
			lessonCount: 27,
		},
		{
			id: 4,
			title: 'Mảng',
			expanded: false,
			lessons: [],
			lessonCount: 18,
		},
		{
			id: 5,
			title: 'String',
			expanded: false,
			lessons: [],
			lessonCount: 6,
		},
		{
			id: 6,
			title: 'Hàm',
			expanded: false,
			lessons: [],
			lessonCount: 30,
		},
		{
			id: 7,
			title: 'Con trỏ',
			expanded: false,
			lessons: [],
			lessonCount: 4,
		},
		{
			id: 8,
			title: 'Struct',
			expanded: false,
			lessons: [],
			lessonCount: 4,
		},
		{
			id: 9,
			title: 'Làm việc với file',
			expanded: false,
			lessons: [],
			lessonCount: 3,
		},
		{
			id: 10,
			title: 'Hướng đối tượng (OOP)',
			expanded: false,
			lessons: [],
			lessonCount: 10,
		},
		{
			id: 11,
			title: 'Hoàn thành khóa học',
			expanded: false,
			lessons: [],
			lessonCount: 1,
		},
	];

	const courseFeatures = [
		{ icon: <CheckCircleOutlined />, text: 'Trình độ cơ bản' },
		{ icon: <CheckCircleOutlined />, text: 'Tổng số 138 bài học' },
		{ icon: <CheckCircleOutlined />, text: 'Thời lượng 10 giờ 29 phút' },
		{ icon: <CheckCircleOutlined />, text: 'Học mọi lúc, mọi nơi' },
	];

	// Navigation items
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	return (
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
			{/* Header */}
			<Header />
			{/* Sidebar */}
			<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} />

			{/* Main Content */}
			<Layout style={{ backgroundColor: '#f5f5f5', margin: '120px 120px 60px' }}>
				<Content style={{}}>
					<Row gutter={[24, 24]}>
						{/* Left Content - Course Details */}
						<Col xs={24} md={16}>
							<Title level={2} style={{ margin: '0 0 16px', fontWeight: 'bold' }}>
								{courseData.title}
							</Title>
							<Paragraph style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
								{courseData.description}
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
											{courseData.chapters} chương • {courseData.lessons} bài học • Thời lượng {courseData.duration}
										</Text>
									</div>
									<Button type='link' style={{ color: '#f05123' }}>
										Mở rộng tất cả
									</Button>
								</div>

								{/* Course Content Accordion */}
								<div>
									{lessonsList.map((chapter) => (
										<div
											key={chapter.id}
											style={{ marginBottom: '8px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}
										>
											{/* Chapter header */}
											<div
												style={{
													padding: '12px 16px',
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													cursor: 'pointer',
													borderLeft: expandedLessons.includes(chapter.id)
														? '4px solid #f05123'
														: '4px solid transparent',
												}}
												onClick={() => toggleExpand(chapter.id)}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<div
														style={{
															marginRight: '12px',
															color: expandedLessons.includes(chapter.id) ? '#f05123' : '#666',
															transform: expandedLessons.includes(chapter.id) ? 'rotate(90deg)' : 'rotate(0deg)',
															transition: 'transform 0.3s ease',
														}}
													>
														<PlusOutlined />
													</div>
													<Text strong style={{ color: expandedLessons.includes(chapter.id) ? '#f05123' : '#333' }}>
														{chapter.id}. {chapter.title}
													</Text>
												</div>
												<Text style={{ color: '#666' }}>{chapter.lessonCount} bài học</Text>
											</div>

											{/* Lessons for expanded chapters */}
											{expandedLessons.includes(chapter.id) && chapter.lessons.length > 0 && (
												<div>
													{chapter.lessons.map((lesson) => (
														<div
															key={lesson.id}
															style={{
																padding: '12px 16px 12px 48px',
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
																borderTop: '1px solid #f1f1f1',
																backgroundColor: lesson.id === 1 ? '#fff3ef' : '#fff',
																cursor: 'pointer',
															}}
														>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	color: lesson.id === 1 ? '#f05123' : '#333',
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
																	{lesson.completed ? (
																		<CheckCircleOutlined style={{ color: '#4caf50' }} />
																	) : (
																		<div
																			style={{
																				width: '16px',
																				height: '16px',
																				borderRadius: '50%',
																				border: '2px solid #d3d3d3',
																				backgroundColor: lesson.id === 1 ? '#f05123' : 'transparent',
																				position: 'relative',
																			}}
																		>
																			{lesson.id === 1 && (
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
																	)}
																</div>
																<Text style={{ color: lesson.id === 1 ? '#f05123' : '#333' }}>
																	{lesson.id}. {lesson.title}
																</Text>
															</div>
															<Text style={{ color: '#666' }}>{lesson.duration}</Text>
														</div>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</Col>

						{/* Right Content - Course Preview and Registration */}
						<Col xs={24} md={8}>
							<div style={{ position: 'sticky', top: '88px' }}>
								{/* Video Preview */}
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
											}}
										>
											<div
												style={{
													width: '100px',
													height: '100px',
													background: 'rgba(0,0,0,0.4)',
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													cursor: 'pointer',
												}}
											>
												<PlayCircleOutlined style={{ fontSize: '40px', color: '#fff' }} />
											</div>

											<div
												style={{
													position: 'absolute',
													bottom: 0,
													left: '50%',
													transform: 'translateX(-50%)',
													width: '70%',
													height: '70%',
												}}
											>
												<div
													style={{
														position: 'absolute',
														bottom: '-30px',
														left: '50%',
														transform: 'translateX(-50%)',
														fontSize: '80px',
														color: '#9DDAED',
													}}
												>
													C++
												</div>
											</div>
										</div>

										<div style={{ padding: '24px 20px', textAlign: 'center' }}>
											<Title level={4} style={{ fontWeight: 'bold', margin: '0 0 16px' }}>
												Xem giới thiệu khóa học
											</Title>

											<div
												style={{
													backgroundColor: courseData.type === 'Miễn phí' ? '#EAF5FE' : '#FFF3EF',
													color: courseData.type === 'Miễn phí' ? '#1677ff' : '#f05123',
													padding: '4px 12px',
													borderRadius: '4px',
													display: 'inline-block',
													fontWeight: 'bold',
													fontSize: '20px',
													marginBottom: '16px',
												}}
											>
												{courseData.type}
											</div>

											<Button
												type='primary'
												size='large'
												block
												style={{
													backgroundColor: courseData.isRegistered ? '#ccc' : '#1677ff',
													height: '40px',
													fontWeight: 'bold',
												}}
											>
												ĐĂNG KÝ HỌC
											</Button>
										</div>
									</div>
								</div>

								{/* Course Features */}
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
								</div>
							</div>
						</Col>
					</Row>
				</Content>
			</Layout>
			{/* Footer */}
			<Footer />
		</Layout>
	);
};

export default KhoaHocPage;
