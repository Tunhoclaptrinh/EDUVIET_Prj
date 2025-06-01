import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Siderbar';

import { Button, Card, Col, Row, Typography, Layout, Spin, message } from 'antd';
import { Link } from 'umi';

import {
	HomeOutlined,
	ReadOutlined,
	FileTextOutlined,
	EyeOutlined,
	ClockCircleOutlined,
	UserOutlined,
	StarOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface SidebarNavItem {
	key: string;
	icon: React.ReactElement;
	text: string;
	to: string;
}

const TrangChuPage: React.FC = () => {
	const [courses, setCourses] = useState<Course.IRecord[]>([]);
	const [categories, setCategories] = useState<Category.IRecord[]>([]);
	const [blogPosts, setBlogPosts] = useState<BlogPost.IRecord[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const sidebarNavItems: SidebarNavItem[] = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = (): void => {
		console.log('Voice mode activated');
	};

	// Fetch data from APIs
	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				setLoading(true);
				const [coursesRes, categoriesRes, blogPostsRes] = await Promise.all([
					axios.get<Course.IRecord[]>('http://localhost:3000/courses'),
					axios.get<Category.IRecord[]>('http://localhost:3000/categories'),
					axios.get<BlogPost.IRecord[]>('http://localhost:3000/blogPosts'),
				]);

				setCourses(coursesRes.data);
				setCategories(categoriesRes.data);
				setBlogPosts(blogPostsRes.data);
			} catch (error) {
				console.error('Error fetching data:', error);
				message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Separate courses into pro and free
	const proCourses: Course.IRecord[] = courses.filter((course) => course.price > 0);
	const freeCourses: Course.IRecord[] = courses.filter((course) => course.price === 0);

	const formatPrice = (price: number): string => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat('vi-VN').format(num);
	};

	if (loading) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
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

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header />
			<Layout style={{ margin: '80px 120px 60px' }}>
				<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} />

				<Content style={{ marginTop: 80 }}>
					{/* Hero Section */}
					<div
						style={{
							background: 'linear-gradient(90deg, #8e2de2, #4a00e0)',
							padding: '40px 20px',
							margin: '20px 0',
							borderRadius: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<div>
							<Title style={{ color: '#fff', margin: 0 }}>Bận rộn? Hãy để các khóa học Pro giúp bạn!</Title>
							<Paragraph style={{ color: '#fff', fontSize: '16px' }}>
								Dù bạn bận rộn đến đâu, các khóa học chất lượng cao tại đây sẽ giúp bạn nắm vững kiến thức một cách hiệu
								quả nhất.
							</Paragraph>
							<Link to='/courses'>
								<Button
									type='primary'
									size='large'
									style={{
										background: '#fff',
										color: '#8e2de2',
										border: 'none',
										borderRadius: '20px',
									}}
								>
									BẮT ĐẦU HỌC
								</Button>
							</Link>
						</div>
						<div>
							<img
								src='https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
								alt='banner illustration'
								style={{ maxWidth: '400px', borderRadius: '8px' }}
							/>
						</div>
					</div>

					{/* Pro Courses Section */}
					{proCourses.length > 0 && (
						<div style={{ padding: '40px 0px' }}>
							<Title level={2}>Khóa học Pro mới</Title>
							<Row gutter={[16, 16]} justify='start'>
								{proCourses.slice(0, 6).map((course, index) => (
									<Col xs={24} sm={12} md={8} key={course.id}>
										<Link to={`/khoa-hoc/${course.id}`}>
											<Card
												hoverable
												cover={
													<div style={{ position: 'relative', height: '225px', overflow: 'hidden' }}>
														<img
															src={course.thumbnail}
															alt={course.title}
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
																borderRadius: '8px 8px 0 0',
															}}
														/>
														<div
															style={{
																position: 'absolute',
																bottom: 0,
																left: 0,
																right: 0,
																background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
																padding: '20px 15px 15px',
																color: 'white',
															}}
														>
															<Title level={4} style={{ color: '#fff', margin: 0, fontSize: '16px' }}>
																{course.title}
															</Title>
														</div>
													</div>
												}
											>
												<Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginBottom: '12px',
													}}
												>
													<div>
														<Paragraph
															style={{
																margin: 0,
																fontWeight: 'bold',
																color: '#ff6b6b',
																fontSize: '16px',
															}}
														>
															{formatPrice(course.price)}
														</Paragraph>
														{course.certification_price && (
															<Paragraph
																style={{
																	margin: 0,
																	color: '#888',
																	fontSize: '12px',
																}}
															>
																Chứng chỉ: {formatPrice(course.certification_price)}
															</Paragraph>
														)}
													</div>
													<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
														<StarOutlined style={{ color: '#faad14' }} />
														<span>{course.avg_rating || 'N/A'}</span>
													</div>
												</div>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														color: '#888',
														fontSize: '12px',
													}}
												>
													<span>
														<UserOutlined /> {formatNumber(course.enrolled_count)} học viên
													</span>
													<span>Mã: {course.course_code}</span>
												</div>
											</Card>
										</Link>
									</Col>
								))}
							</Row>
						</div>
					)}

					{/* Free Courses Section */}
					{freeCourses.length > 0 && (
						<div style={{ padding: '40px 0px' }}>
							<Title level={2}>Khóa học miễn phí</Title>
							<Row gutter={[16, 16]} justify='start'>
								{freeCourses.slice(0, 8).map((course, index) => (
									<Col xs={24} sm={12} md={8} lg={6} key={course.id}>
										<Link to={`/khoa-hoc/${course.id}`}>
											{/* Thêm Link để chuyển hướng */}
											<Card
												hoverable
												cover={
													<div style={{ position: 'relative', height: '169px', overflow: 'hidden' }}>
														<img
															src={course.thumbnail}
															alt={course.title}
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
																borderRadius: '8px 8px 0 0',
															}}
														/>
														<div
															style={{
																position: 'absolute',
																bottom: 0,
																left: 0,
																right: 0,
																background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
																padding: '15px 10px 10px',
																color: 'white',
															}}
														>
															<Title level={5} style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
																{course.title}
															</Title>
														</div>
													</div>
												}
											>
												<Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<Paragraph style={{ margin: 0, color: '#888' }}>
														{formatNumber(course.enrolled_count)} học viên
													</Paragraph>
													<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
														<StarOutlined style={{ color: '#faad14' }} />
														<span style={{ fontSize: '12px' }}>{course.avg_rating || 'N/A'}</span>
													</div>
												</div>
											</Card>
										</Link>
									</Col>
								))}
							</Row>
						</div>
					)}

					{/* Featured Articles Section */}
					{blogPosts.length > 0 && (
						<div style={{ padding: '40px 0px' }}>
							<Title level={2}>Bài viết nổi bật</Title>
							<Row gutter={[16, 16]} justify='start'>
								{blogPosts.slice(0, 8).map((article, index) => (
									<Col xs={24} sm={12} md={8} lg={6} key={article.id}>
										<Card
											hoverable
											cover={
												<img
													alt={article.title}
													src={
														article.thumbnail ||
														'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
													}
													style={{
														borderRadius: '8px 8px 0 0',
														height: '180px',
														objectFit: 'cover',
													}}
												/>
											}
										>
											<Title level={5} ellipsis={{ rows: 2 }}>
												{article.title}
											</Title>
											<Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666' }}>
												{article.excerpt}
											</Paragraph>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													marginTop: '12px',
												}}
											>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '8px',
													}}
												>
													<img
														src='https://avatars.githubusercontent.com/u/146623045?v=4'
														alt='author'
														style={{ width: '24px', borderRadius: '50%' }}
													/>
													<span style={{ fontSize: '12px', color: '#666' }}>Tác giả</span>
												</div>
												<span style={{ fontSize: '12px', color: '#888' }}>
													{new Date(article.published_at).toLocaleDateString('vi-VN')}
												</span>
											</div>
										</Card>
									</Col>
								))}
							</Row>
						</div>
					)}
				</Content>
			</Layout>
			<Footer />
		</Layout>
	);
};

export default TrangChuPage;
