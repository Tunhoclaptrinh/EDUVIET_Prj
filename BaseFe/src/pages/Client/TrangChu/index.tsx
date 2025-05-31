import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Siderbar';

import { Button, Card, Col, Row, Typography, Layout } from 'antd';
import { Link } from 'umi';

import { HomeOutlined, ReadOutlined, FileTextOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const TrangChuPage = () => {
	const sidebarNavItems = [
		{ key: '1', icon: <HomeOutlined />, text: 'Trang chủ', to: '/' },
		{ key: '2', icon: <ReadOutlined />, text: 'Lập trình', to: '/programming' },
		{ key: '3', icon: <FileTextOutlined />, text: 'Bài viết', to: '/articles' },
	];

	const handleVoiceClick = () => {
		console.log('Voice mode activated');
	};

	// Sample data for sections
	const proCourses = [
		{
			title: 'HTML, CSS Pro',
			description: 'Cho người mới bắt đầu',
			price: '2.500.000đ',
			discountedPrice: '1.299.000đ',
			students: 950,
			duration: '116h50p',
			gradient: 'linear-gradient(90deg, #1e3c72, #2a5298)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'JavaScript Pro',
			description: 'Cho người mới bắt đầu',
			price: '3.299.000đ',
			discountedPrice: '1.399.000đ',
			students: 213,
			duration: '42h23p',
			gradient: 'linear-gradient(90deg, #f7971e, #ffd200)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'Ngôn ngữ Sass',
			description: 'Cho FrontEnd Developer',
			price: '400.000đ',
			discountedPrice: '299.000đ',
			students: 27,
			duration: '6h18p',
			gradient: 'linear-gradient(90deg, #ff6b6b, #f0a8d0)',
			instructor: 'Sơn Đặng',
		},
	];

	const freeCourses = [
		{
			title: 'Kiến Thức Nhập Môn',
			description: 'Kiến Thức Nhập Môn IT',
			students: 154515,
			gradient: 'linear-gradient(90deg, #00c4b4, #00e676)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'Tự động hóa',
			description: 'Lập trình C++ cơ bản, nâng cao',
			students: 134525,
			gradient: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'HTML, CSS',
			description: 'HTML, CSS từ Zero đến Hero',
			students: 132525,
			gradient: 'linear-gradient(90deg, #1e3c72, #2a5298)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'Responsive',
			description: 'Responsive Với Grid System',
			students: 114514,
			gradient: 'linear-gradient(90deg, #8e2de2, #4a00e0)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'JavaScript Cơ bản',
			description: 'Lập trình JavaScript Cơ bản',
			students: 134525,
			gradient: 'linear-gradient(90deg, #f7971e, #ffd200)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'JavaScript Nâng cao',
			description: 'Lập trình JavaScript Nâng cao',
			students: 124525,
			gradient: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'WSL Ubuntu',
			description: 'Làm việc với Terminal & Ubuntu',
			students: 104514,
			gradient: 'linear-gradient(90deg, #00c4b4, #00e676)',
			instructor: 'Sơn Đặng',
		},
		{
			title: 'React JS',
			description: 'React JS Website với API',
			students: 94514,
			gradient: 'linear-gradient(90deg, #1e3c72, #2a5298)',
			instructor: 'Sơn Đặng',
		},
	];

	const articles = [
		{
			title: 'Từng bước để các bạn có thể tự học lập trình',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			author: 'Sơn Đặng',
			views: 1345,
		},
		{
			title: 'Học ReactJS tại F8 đầy đủ và chi tiết nhất',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			author: 'Sơn Đặng',
			views: 1234,
		},
		{
			title: 'Dành cho bạn: Tổng hợp tài liệu tự học GitHub',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			author: 'Sơn Đặng',
			views: 1123,
		},
		{
			title: 'Kỷ niệm 25/3: Chúng tôi đã học lập trình như thế nào?',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			author: 'Sơn Đặng',
			views: 1012,
		},
	];

	const videos = [
		{
			title: 'Chúng tôi đã học lập trình như thế nào?',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1345,
			duration: '12:34',
		},
		{
			title: 'HTML, CSS từ Zero đến Hero - Bài 1',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1234,
			duration: '10:20',
		},
		{
			title: 'Phương pháp học lập trình hiệu quả tại F8',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1123,
			duration: '15:45',
		},
		{
			title: 'Code 300 dòng thiên nhiên cùng anh Sơn Đặng',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1012,
			duration: '8:30',
		},
		{
			title: 'JavaScript Cơ bản - Bài 1',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1345,
			duration: '12:34',
		},
		{
			title: 'React JS - Bài 1',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1234,
			duration: '10:20',
		},
		{
			title: 'HTML, CSS từ Zero đến Hero - Bài 2',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1123,
			duration: '15:45',
		},
		{
			title: 'Kỷ niệm 25/3: Chúng tôi đã học lập trình như thế nào?',
			image: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
			views: 1012,
			duration: '8:30',
		},
	];

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header />
			<Layout style={{ margin: '80px 120px 60px' }}>
				{/* Sticker Sidebar instead of regular sidebar */}
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
							<Title style={{ color: '#fff', margin: 0 }}>Bận rộn? Hãy để JavaScript Pro giúp bạn!</Title>
							<Paragraph style={{ color: '#fff', fontSize: '16px' }}>
								Dù bạn bận rộn đến đâu, khóa học JavaScript Pro tại F8 sẽ giúp bạn nắm vững lập trình một cách hiệu quả
								nhất.
							</Paragraph>
							<Link to='/register'>
								<Button
									type='primary'
									size='large'
									style={{ background: '#fff', color: '#8e2de2', border: 'none', borderRadius: '20px' }}
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
					<div style={{ padding: '40px 0px' }}>
						<Title level={2}>Khóa học Pro mới</Title>
						<Row gutter={[16, 16]} justify='start'>
							{proCourses.map((course, index) => (
								<Col xs={24} sm={12} md={8} key={index}>
									<Card
										hoverable
										cover={
											<div
												style={{
													background: course.gradient,
													height: '100px',
													borderRadius: '8px 8px 0 0',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Title level={4} style={{ color: '#fff', margin: 0 }}>
													{course.title}
												</Title>
											</div>
										}
									>
										<Paragraph>{course.description}</Paragraph>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div>
												<Paragraph style={{ margin: 0, fontWeight: 'bold', color: '#ff6b6b' }}>
													{course.price}
												</Paragraph>
												<Paragraph style={{ margin: 0, textDecoration: 'line-through', color: '#888' }}>
													{course.discountedPrice}
												</Paragraph>
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<img
													src='https://avatars.githubusercontent.com/u/146623045?v=4'
													alt='instructor'
													style={{ width: '24px', borderRadius: '50%' }}
												/>
												<Paragraph style={{ margin: 0 }}>{course.instructor}</Paragraph>
											</div>
										</div>
										<div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
											<Paragraph style={{ margin: 0, color: '#888' }}>{course.students}</Paragraph>
											<Paragraph style={{ margin: 0, color: '#888' }}>{course.duration}</Paragraph>
										</div>
									</Card>
								</Col>
							))}
						</Row>
					</div>

					{/* Free Courses Section */}
					<div style={{ padding: '40px 0px' }}>
						<Title level={2}>Khóa học hoàn thành phí</Title>
						<Row gutter={[16, 16]} justify='start'>
							{freeCourses.map((course, index) => (
								<Col xs={24} sm={12} md={8} lg={6} key={index}>
									<Card
										hoverable
										cover={
											<div
												style={{
													background: course.gradient,
													height: '100px',
													borderRadius: '8px 8px 0 0',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Title level={4} style={{ color: '#fff', margin: 0 }}>
													{course.title}
												</Title>
											</div>
										}
									>
										<Paragraph>{course.description}</Paragraph>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Paragraph style={{ margin: 0, color: '#888' }}>{course.students} học viên</Paragraph>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<img
													src='https://avatars.githubusercontent.com/u/146623045?v=4'
													alt='instructor'
													style={{ width: '24px', borderRadius: '50%' }}
												/>
												<Paragraph style={{ margin: 0 }}>{course.instructor}</Paragraph>
											</div>
										</div>
									</Card>
								</Col>
							))}
						</Row>
					</div>

					{/* Featured Articles Section */}
					<div style={{ padding: '40px 0px' }}>
						<Title level={2}>Bài viết nổi bật</Title>
						<Row gutter={[16, 16]} justify='start'>
							{articles.map((article, index) => (
								<Col xs={24} sm={12} md={8} lg={6} key={index}>
									<Card
										hoverable
										cover={<img alt={article.title} src={article.image} style={{ borderRadius: '8px 8px 0 0' }} />}
									>
										<Title level={5}>{article.title}</Title>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<img
													src='https://avatars.githubusercontent.com/u/146623045?v=4'
													alt='author'
													style={{ width: '24px', borderRadius: '50%' }}
												/>
												<Paragraph style={{ margin: 0 }}>{article.author}</Paragraph>
											</div>
											<Paragraph style={{ margin: 0, color: '#888' }}>
												<EyeOutlined /> {article.views}
											</Paragraph>
										</div>
									</Card>
								</Col>
							))}
						</Row>
					</div>

					<div style={{ padding: '40px 0px' }}>
						<Title level={2}>Videos nổi bật</Title>
						<Row gutter={[16, 16]} justify='start'>
							{videos.map((video, index) => (
								<Col xs={24} sm={12} md={8} lg={6} key={index}>
									<Card
										hoverable
										cover={<img alt={video.title} src={video.image} style={{ borderRadius: '8px 8px 0 0' }} />}
									>
										<Title level={5}>{video.title}</Title>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Paragraph style={{ margin: 0, color: '#888' }}>
												<EyeOutlined /> {video.views}
											</Paragraph>
											<Paragraph style={{ margin: 0, color: '#888' }}>
												<ClockCircleOutlined /> {video.duration}
											</Paragraph>
										</div>
									</Card>
								</Col>
							))}
						</Row>
					</div>
				</Content>
			</Layout>
			<Footer />
		</Layout>
	);
};

export default TrangChuPage;
