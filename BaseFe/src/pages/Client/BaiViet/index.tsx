import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Siderbar';

import { Button, Col, Row, Typography, Layout, Avatar, Tag, Divider, Tooltip, Spin, message } from 'antd';
import { Link } from 'umi';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { HomeOutlined, ReadOutlined, FileTextOutlined, BookOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const BaiVietPage = () => {
	const [blogPosts, setBlogPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/public/trang-chu' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/public/bai-viet' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	useEffect(() => {
		const fetchBlogPosts = async () => {
			try {
				setLoading(true);
				// Lấy danh sách bài viết từ API
				const response = await axios.get('http://localhost:3000/blogPosts');
				
				// Lọc bài viết đã xuất bản
				const publishedPosts = response.data.filter((post: any) => post.status === 'published');
				
				// Lấy thông tin tác giả cho mỗi bài viết
				const postsWithAuthors = await Promise.all(
					publishedPosts.map(async (post: any) => {
						try {
							const authorResponse = await axios.get(`http://localhost:3000/users/${post.author_id}`);
							return {
								...post,
								id: post.id,
								title: post.title,
								description: post.excerpt,
								author: authorResponse.data?.full_name || 'Tác giả',
								authorAvatar: 'https://i.pravatar.cc/150?img=' + (post.id % 70),
								tags: [
									post.slug?.split('-')[0] || 'Công nghệ', 
									new Date(post.published_at).toLocaleDateString('vi-VN'),
									`${Math.floor(post.content.length / 500)} phút đọc`
								],
								image: post.thumbnail
							};
						} catch (error) {
							console.error(`Error fetching author for post ${post.id}:`, error);
							return {
								...post,
								id: post.id,
								title: post.title,
								description: post.excerpt,
								author: 'Tác giả',
								authorAvatar: 'https://i.pravatar.cc/150?img=' + (post.id % 70),
								tags: [
									post.slug?.split('-')[0] || 'Công nghệ',
									new Date(post.published_at).toLocaleDateString('vi-VN'),
									`${Math.floor(post.content.length / 500)} phút đọc`
								],
								image: post.thumbnail
							};
						}
					})
				);
				
				setBlogPosts(postsWithAuthors);
			} catch (error) {
				console.error('Error fetching blog posts:', error);
				message.error('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
			} finally {
				setLoading(false);
			}
		};
		
		fetchBlogPosts();
	}, []);

	if (loading) {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Header />
				<Layout style={{ margin: '100px 120px 60px' }}>
					<Content style={{ marginTop: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Spin size="large" tip="Đang tải danh sách bài viết..." />
					</Content>
				</Layout>
				<Footer />
			</Layout>
		);
	}

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header />
			<Layout style={{ margin: '100px 120px 60px' }}>
				{/* Sidebar */}
				<Sidebar navItems={sidebarNavItems} onVoiceClick={handleVoiceClick} />

				<Content style={{ marginTop: 40 }}>
					<Row gutter={24}>
						{/* Main Content - Blog Posts */}
						<Col xs={24} sm={24} md={18} lg={18}>
							{/* Page Title */}
							<div style={{ marginBottom: 30 }}>
								<Title level={2}>Bài viết nổi bật</Title>
								<Paragraph style={{ color: '#666' }}>
									Tổng hợp các bài viết chia sẻ về kiến thức, lập trình, chia sẻ về kinh nghiệm tự học, lập trình online
									và các kỹ thuật lập trình web.
								</Paragraph>
							</div>

							{/* Blog Posts */}
							<div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
								{blogPosts.length > 0 ? (
									blogPosts.map((post, index) => (
									<div key={post.id}>
										<div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
											<div style={{ flex: 1 }}>
												<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
													<Avatar src={post.authorAvatar} size={32} />
													<Text strong style={{ marginLeft: '8px' }}>
														{post.author}
													</Text>
												</div>

													<Link to={`/public/bai-viet/chi-tiet/${post.id}`}>
													<Title level={4} style={{ marginBottom: '8px', fontWeight: 600 }}>
														{post.title}
													</Title>
												</Link>

												<Paragraph style={{ color: '#666', marginBottom: '12px' }}>{post.description}</Paragraph>

												<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
														{post.tags.map((tag: string, tagIndex: number) => (
														<Tag key={tagIndex} style={{ background: '#f5f5f5', border: 'none', color: '#666' }}>
															{tag}
														</Tag>
													))}
												</div>
											</div>

											<div style={{ width: '200px', flexShrink: 0 }}>
													<Link to={`/public/bai-viet/chi-tiet/${post.id}`}>
													<img
														src={post.image}
														alt={post.title}
														style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
													/>
												</Link>
											</div>

											<div style={{ display: 'flex', alignItems: 'flex-start' }}>
												<Tooltip title='Lưu bài viết'>
													<Button type='text' icon={<BookOutlined />} />
												</Tooltip>
												<Tooltip title='Tùy chọn'>
													<Button type='text' icon={<EllipsisOutlined />} />
												</Tooltip>
											</div>
										</div>

										{index < blogPosts.length - 1 && <Divider style={{ margin: 0 }} />}
									</div>
									))
								) : (
									<div style={{ padding: '40px', textAlign: 'center' }}>
										<Paragraph>Không có bài viết nào.</Paragraph>
									</div>
								)}
							</div>
						</Col>

						{/* Right Sidebar */}
						<Col xs={24} sm={24} md={5} lg={5} offset={1}>
							{/* Filter by topic */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
								<div
									style={{
										background: '#f5f5f5',
										padding: '16px',
										borderRadius: '8px',
										marginBottom: '20px',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<Title level={5} style={{ marginTop: 0, fontSize: 20, textAlign: 'center' }}>
										XEM CÁC BÀI VIẾT <br />
										THEO CHỦ ĐỀ
									</Title>

									<div style={{ gap: '8px', margin: 8 }}>
										<Tag color='#908ee9' style={{ padding: '6px 10px', cursor: 'pointer', margin: '8px' }}>
											Mobile apps
										</Tag>
										<Tag color='#108ee9' style={{ padding: '6px 10px', cursor: 'pointer', margin: '8px' }}>
											Front-end
										</Tag>
										<Tag color='#87d068' style={{ padding: '6px 10px', cursor: 'pointer', margin: '8px' }}>
											Back-end / DevOps
										</Tag>
										<Tag color='#2db7f5' style={{ padding: '6px 10px', cursor: 'pointer', margin: '8px' }}>
											UI / UX / Design
										</Tag>
										<Tag style={{ padding: '6px 10px', cursor: 'pointer', margin: '8px' }}>Others</Tag>
									</div>
								</div>
							</div>

							{/* Vertical Pagination */}
							<div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
								<Title
									level={5}
									style={{ margin: 16, textAlign: 'center', borderTop: '2px solid #d9d9d9', paddingTop: 20 }}
								>
									TRANG
								</Title>

								<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
									<div
										style={{
											padding: '6px 12px',
											background: '#f05123',
											color: '#fff',
											borderRadius: '10px',
											textAlign: 'center',
											fontWeight: 'bold',
											cursor: 'pointer',
											width: '60px',
											margin: '0 auto',
										}}
									>
										1
									</div>

									{[2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
										<div
											key={page}
											style={{
												padding: '6px 12px',
												border: '1px solid #d9d9d9',
												borderRadius: '10px',
												textAlign: 'center',
												cursor: 'pointer',
												background: '#fff',
												width: '60px',
												margin: '0 auto',
											}}
										>
											{page}
										</div>
									))}

									<div
										style={{
											padding: '6px 12px',
											border: '1px solid #d9d9d9',
											borderRadius: '10px',
											textAlign: 'center',
											cursor: 'pointer',
											background: '#fff',
											width: '60px',
											margin: '0 auto',
										}}
									>
										...
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

export default BaiVietPage;
