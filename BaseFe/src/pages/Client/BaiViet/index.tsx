import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Siderbar';

import { Button, Col, Row, Typography, Layout, Avatar, Tag, Divider, Tooltip } from 'antd';
import { Link } from 'umi';

import { HomeOutlined, ReadOutlined, FileTextOutlined, BookOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const BaiVietPage = () => {
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	// Sample data for blog posts
	const blogPosts = [
		{
			id: 1,
			title: '[HTML - CSS - JS tại F8] Một thời máy móc, lục lại được trang web cũ - chia sẻ cùng anh em',
			description: 'HTML - CSS - JS tại F8! Một thời máy móc, lục lại được trang web cũ - chia sẻ cùng anh em',
			author: 'Hà Đoàn',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['JavaScript', '6 ngày trước', '2 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 2,
			title: 'Hoàng Bảo Trung - Học viên tiêu biểu của F8 tỏa sáng với dự án "AI Powered Learning"',
			description:
				'Trong thời đại công nghệ số 4.0, việc học không còn bó buộc trong những cuốn sách truyền thống. Giữa đây, trí tuệ nhân tạo (AI) đang...',
			author: 'Sơn Đặng',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['ReactJS', '8 tháng trước', '6 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 3,
			title: 'Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày',
			description:
				'Xin chào mọi người mình là Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 300 bài viết. Bài viết này...',
			author: 'Lê Cao Nguyên',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['Front-end', 'một năm trước', '4 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 4,
			title: 'Thư cảm ơn gửi đến anh Sơn',
			description:
				'Xin chào mọi người và anh Sơn. Em tên là Lê Cao Nguyên năm nay 2022 em có vài lời muốn thầy nhưng video giây học của anh trên...',
			author: 'Lê Cao Nguyên',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['một năm trước', '1 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 5,
			title: 'Config Zsh bằng Oh-my-zsh và P10k trên WSL cực ngầu ⭐',
			description: 'Hello anh em, hôm nay mình muốn chia sẻ một trang trí cơ bản trong Ubuntu, nhưng sẽ làm cái...',
			author: 'Erich Tam',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['Ubuntu', 'một năm trước', '4 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 6,
			title: 'LÀ THÀNH VIÊN CỦA F8. BẠN ĐÃ THỰC SỰ SỬ DỤNG "F8" HIỆU QUẢ CHƯA?',
			description:
				'F8 về thực ban đầu chính xác bằng vì thі dây ra với đề. F8 là phần tất mặc định trong VScode các bạn nhỏ (không phải cài thêm bất cứ Extension nào)',
			author: 'Hòa Nguyễn Thanh',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['một năm trước', '12 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 7,
			title: 'Tôi đã viết Chrome extension đầu tiên của mình bằng Github Copilot như thế nào?',
			description:
				'Cảm cảnh của tôi là Tú đang học tiếng Nhật trên một trang web là Duolingo.com, và tôi học từ một trên trang web tới với...',
			author: 'Trọng Nam Đoàn',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['JavaScript', 'một năm trước', '5 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 8,
			title: 'Authentication & Authorization trong ReactJS',
			description:
				'Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền...',
			author: 'Đào Nguyễn',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['ReactJS', '2 năm trước', '9 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 9,
			title: 'Hướng dẫn chi tiết cách sử dụng Dev Mode trong khóa Pro',
			description:
				'Chào bạn! Nếu bạn đã là học viên khóa Pro của F8, chắc hẳn bạn đã biết tới "Dev Mode", giúp thực hành code song song khi xem...',
			author: 'Sơn Đặng',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['Front-end', '2 năm trước', '4 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
		{
			id: 10,
			title: 'Cách chỉnh theme Oh-my-posh cho Powershell',
			description:
				'Hello các người tnôi, mọi người biết để tái tạo môi trươi Zshwarts chắc hẳn đã nghĩ tới PowerShell, những bù lại cái màn hình...',
			author: 'Erich Tam',
			authorAvatar: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			tags: ['Terminal', '2 năm trước', '2 phút đọc'],
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
		},
	];

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
								{blogPosts.map((post, index) => (
									<div key={post.id}>
										<div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
											<div style={{ flex: 1 }}>
												<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
													<Avatar src={post.authorAvatar} size={32} />
													<Text strong style={{ marginLeft: '8px' }}>
														{post.author}
													</Text>
												</div>

												<Link to={`/blog/${post.id}`}>
													<Title level={4} style={{ marginBottom: '8px', fontWeight: 600 }}>
														{post.title}
													</Title>
												</Link>

												<Paragraph style={{ color: '#666', marginBottom: '12px' }}>{post.description}</Paragraph>

												<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
													{post.tags.map((tag, tagIndex) => (
														<Tag key={tagIndex} style={{ background: '#f5f5f5', border: 'none', color: '#666' }}>
															{tag}
														</Tag>
													))}
												</div>
											</div>

											<div style={{ width: '200px', flexShrink: 0 }}>
												<Link to={`/blog/${post.id}`}>
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
								))}
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
