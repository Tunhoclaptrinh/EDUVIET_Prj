import { Layout, Typography, Row, Col } from 'antd';
import { HomeOutlined, ReadOutlined, FileTextOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';

import Sidebar from '@/components/Siderbar';
import { useState } from 'react';
import HeaderBaiHoc from '@/components/Header/HeaderBaiHoc';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const BaiHocPage = () => {
	// State để mở rộng các chương
	const [expandedLessons, setExpandedLessons] = useState([1]);

	const toggleExpand = (lessonId: number) => {
		if (expandedLessons.includes(lessonId)) {
			setExpandedLessons(expandedLessons.filter((id) => id !== lessonId));
		} else {
			setExpandedLessons([...expandedLessons, lessonId]);
		}
	};

	// Dữ liệu cho sidebar (danh sách các chương)
	const lessonsList = [
		{
			id: 1,
			title: 'IFE, Scope, Closure',
			lessons: [
				{ id: 1, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 2, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 3, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 4, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
			],
			lessonCount: 1,
		},
		{
			id: 2,
			title: 'Hoisting, Strict Mode, Data Types',
			lessons: [
				{ id: 1, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 2, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 3, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 4, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
			],
			lessonCount: 7,
		},
		{
			id: 3,
			title: 'This, Bind, Call, Apply',
			lessons: [
				{ id: 1, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 2, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 3, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 4, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
			],
			lessonCount: 5,
		},
		{
			id: 4,
			title: 'Các bài thực hành căn bản',
			lessons: [
				{ id: 1, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 2, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 3, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 4, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
			],
			lessonCount: 1,
		},
		{
			id: 5,
			title: 'Vừa giải trí vừa học',
			lessons: [
				{ id: 1, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 2, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 3, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
				{ id: 4, title: 'IFE, Scope, Closure', duration: '01:14:19', completed: false },
			],
			lessonCount: 3,
		},
	];

	// Dữ liệu điều hướng sidebar
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
			<HeaderBaiHoc />

			{/* Sidebar */}
			<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} stickerOpacity={0.6} />

			{/* Nội dung chính */}
			<Layout style={{ backgroundColor: '#f5f5f5' }}>
				<Content>
					<Row gutter={[24, 24]}>
						{/* Nội dung bài viết */}
						<Col xs={24} md={16} style={{ margin: '50px 0 16px' }}>
							{/* Video bài giảng cố định */}
							<div
								style={{
									// position: 'sticky',
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
								{/* Thay thế bằng video thực tế khi có */}
								<div
									style={{
										zIndex: 10,
										marginBottom: '24px',
										textAlign: 'center',
										background: '#fff',
										borderRadius: '8px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
										marginTop: 0,
										aspectRatio: '16/9',
										width: '100%',
										overflow: 'hidden',
										display: 'block',
									}}
								>
									<iframe
										width='100%'
										height='100%'
										src='https://www.youtube.com/embed/ReQshHb5_RA?si=jpDABuQUV__ongS-'
										title='YouTube video player'
										frameBorder='0'
										allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
										referrerPolicy='strict-origin-when-cross-origin'
										allowFullScreen
										style={{ width: '100%', height: '100%', display: 'block' }}
									></iframe>
								</div>
							</div>

							{/* Nội dung văn bản */}
							<div style={{ margin: 28 }}>
								<Title level={2} style={{ margin: '0 0 16px', fontWeight: 'bold', color: '#f05123' }}>
									Từ code thư viện build UI
								</Title>
								<Paragraph style={{ fontSize: '16px', color: '#333', marginBottom: '24px' }}>
									Cập nhật tháng 7 năm 2023
								</Paragraph>
								<Paragraph style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
									Anh em lụ mày, bây giờ đây với mục đích nâng cao level/kiến thức cho anh em. Thư viện này có thể dùng
									để xây dựng những ứng dụng nhỏ trong quá trình học tập như Todos App, App quản lý X, v.v. Để triển
									khai sản phẩm thực tế sẽ cần phải thêm nhiều tính năng + fix nhiều vấn đề liên quan tới bảo mật & hiệu
									năng.
								</Paragraph>
								<Paragraph style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
									Tham gia nhóm Học lập trình tại F8 trên Facebook để được hướng dẫn trong quá trình học tập ❤️
								</Paragraph>
							</div>
						</Col>

						{/* Sidebar nội dung khóa học */}
						<Col xs={24} md={8}>
							<div style={{ position: 'sticky', top: '70px' }}>
								<div
									style={{
										position: 'sticky',
										backgroundColor: '#fff',
										borderRadius: '8px',
										overflow: 'hidden',
										marginBottom: '16px',
										boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
									}}
								>
									<div></div>
									<Title level={4} style={{ fontWeight: 'bold', margin: '16px' }}>
										Nội dung khóa học
									</Title>
									<div style={{ margin: '0 16px 16px' }}>
										{lessonsList.map((chapter) => (
											<div
												key={chapter.id}
												style={{
													marginBottom: '8px',
													backgroundColor: '#fff',
													borderRadius: '8px',
													overflow: 'hidden',
													border: '1px solid #f1f1f1',
												}}
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

												{/* Lessons cho các chương mở rộng */}
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
							</div>
						</Col>
					</Row>
				</Content>
			</Layout>

			{/* Footer */}
			{/* <Footer /> */}
		</Layout>
	);
};

export default BaiHocPage;
