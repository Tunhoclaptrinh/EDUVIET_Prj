import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Layout, Typography, Avatar, Row, Col, Card, Space, Button, Tooltip } from 'antd';
import { ClockCircleOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
	const [activeYear, setActiveYear] = useState('2024');

	// Mock data for activity heatmap
	const activityMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

	// Mock data for courses
	const courses = [
		{
			id: 1,
			title: 'Node & ExpressJS',
			category: 'Backend',
			color: 'linear-gradient(45deg, #1fd755, #0bb335)',
			students: 47672,
			lessons: 36,
			duration: '12h9p',
			isFree: true,
		},
		{
			id: 2,
			title: 'Responsive Với Grid System',
			category: 'Frontend',
			color: 'linear-gradient(45deg, #ff36f3, #c32bbb)',
			students: 47128,
			lessons: 34,
			duration: '6h31p',
			isFree: true,
		},
		{
			id: 3,
			title: 'Kiến Thức Nhập Môn IT',
			category: 'Basic',
			color: 'linear-gradient(45deg, #ff5656, #c4008c)',
			students: 134522,
			lessons: 9,
			duration: '3h12p',
			isFree: true,
		},
		{
			id: 4,
			title: 'Lập Trình JavaScript Nâng Cao',
			category: 'Frontend',
			color: 'linear-gradient(45deg, #ff7b00, #ff5a00)',
			students: 40692,
			lessons: 19,
			duration: '8h41p',
			isFree: true,
		},
		{
			id: 5,
			title: 'Xây Dựng Website với ReactJS',
			category: 'Frontend',
			color: 'linear-gradient(45deg, #4f21b7, #4b11b0)',
			students: 75546,
			lessons: 112,
			duration: '27h32p',
			isFree: true,
		},
		{
			id: 6,
			title: 'HTML CSS từ Zero đến Hero',
			category: 'Frontend',
			color: 'linear-gradient(45deg, #00bcd4, #00a0d4)',
			students: 210265,
			lessons: 117,
			duration: '29h5p',
			isFree: true,
		},
		{
			id: 7,
			title: 'Lập Trình JavaScript Cơ Bản',
			category: 'Frontend',
			color: 'linear-gradient(45deg, #ffb300, #ff8c00)',
			students: 147666,
			lessons: 112,
			duration: '24h15p',
			isFree: true,
		},
	];

	const generateHeatmapData = () => {
		// This simulates the activity heatmap data
		// In a real application, this would be fetched from an API
		const days = ['Mon', 'Wed', 'Fri'];
		const activityLevels = [0, 1, 2, 3, 4]; // 0 = no activity, 4 = highest activity

		// Create grid for heatmap
		const grid = [];

		for (let i = 0; i < days.length; i++) {
			const row = [];
			for (let j = 0; j < activityMonths.length; j++) {
				// Simulate more activity for recent months
				let probability = j < 7 ? 0.1 : 0.4;
				// Simulate more activity for the "Tiến Tuấn Nguyễn" user
				// by setting some days to have higher activity levels
				const activityLevel =
					Math.random() < probability ? activityLevels[Math.floor(Math.random() * activityLevels.length)] : 0;
				row.push(activityLevel);
			}
			grid.push(row);
		}

		return grid;
	};

	const heatmapData = generateHeatmapData();

	const activityColorMap: { [key: number]: string } = {
		0: '#ebedf0',
		1: '#c6e48b',
		2: '#7bc96f',
		3: '#239a3b',
		4: '#196127',
	};

	return (
		<Layout style={{ minHeight: '100vh', background: '#fff' }}>
			<Header />
			<Content>
				<div style={{ background: '#fff', minHeight: 380, borderRadius: 8, margin: '120px 120px 120px 80px' }}>
					<Row gutter={[24, 24]}>
						{/* Profile Section */}
						<Col xs={24} md={6}>
							<div style={{ textAlign: 'center', position: 'fixed', marginLeft: 80 }}>
								<Avatar
									size={150}
									src='https://avatars.githubusercontent.com/u/146623045?v=4'
									style={{ border: '5px solid #f0f0f0' }}
								/>
								<Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
									Tiến Tuấn Nguyễn
								</Title>
								<Text type='secondary'>@tuannguyen2</Text>

								<Row justify='center' style={{ marginTop: 16 }}>
									<Col span={12}>
										<Title level={5} style={{ margin: 0 }}>
											0
										</Title>
										<Text type='secondary'>người theo dõi</Text>
									</Col>
									<Col span={12}>
										<Title level={5} style={{ margin: 0 }}>
											0
										</Title>
										<Text type='secondary'>đang theo dõi</Text>
									</Col>
								</Row>

								<div style={{ marginTop: 16 }}>
									<Space>
										<TeamOutlined />
										<Text>Tham gia F8 từ 6 tháng trước</Text>
									</Space>
								</div>
							</div>
						</Col>

						{/* Activity Section */}
						<Col xs={24} md={18}>
							<div>
								<div
									style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
								>
									<Title level={4} style={{ margin: 0 }}>
										515 hoạt động trong 12 tháng qua
									</Title>
									<div>
										<Button
											type={activeYear === '2024' ? 'primary' : 'default'}
											size='small'
											onClick={() => setActiveYear('2024')}
											style={{ marginRight: 8 }}
										>
											2024
										</Button>
										<Button
											type={activeYear === '2023' ? 'primary' : 'default'}
											size='small'
											onClick={() => setActiveYear('2023')}
										>
											2023
										</Button>
									</div>
								</div>

								{/* Heatmap */}
								<div style={{ overflowX: 'auto' }}>
									<div style={{ display: 'flex', minWidth: '100%', padding: '12px 0' }}>
										<div style={{ width: '50px', paddingRight: '16px' }}>
											{/* Day labels */}
											{['Mon', 'Wed', 'Fri'].map((day, dayIndex) => (
												<div
													key={day}
													style={{
														height: '24px',
														fontSize: '14px',
														textAlign: 'right',
														marginBottom: '8px',
														lineHeight: '24px',
													}}
												>
													{day}
												</div>
											))}
										</div>

										<div style={{ display: 'flex', flexGrow: 1 }}>
											{activityMonths.map((month, monthIndex) => (
												<div key={month} style={{ display: 'flex', flexDirection: 'column', marginRight: '12px' }}>
													{/* Month label */}
													<div style={{ fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>{month}</div>

													{/* Activity cells for this month */}
													<div style={{ display: 'flex', flexDirection: 'column' }}>
														{heatmapData.map((row, rowIndex) => (
															<Tooltip
																key={`${month}-${rowIndex}`}
																title={`${row[monthIndex]} contributions on ${
																	['Monday', 'Wednesday', 'Friday'][rowIndex]
																}, ${month}`}
															>
																<div
																	style={{
																		width: '24px',
																		height: '24px',
																		margin: '2px',
																		backgroundColor: activityColorMap[row[monthIndex]],
																		borderRadius: '4px',
																	}}
																/>
															</Tooltip>
														))}
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Legend */}
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', fontSize: '14px' }}>
										<span style={{ marginRight: '8px' }}>0 hoạt động</span>
										{[1, 2, 3, 4].map((level) => (
											<div
												key={level}
												style={{
													width: '24px',
													height: '24px',
													backgroundColor: activityColorMap[level],
													marginLeft: '8px',
													borderRadius: '4px',
												}}
											/>
										))}
										<span style={{ marginLeft: '8px' }}>Nhiều hoạt động</span>
									</div>
								</div>

								{/* Courses Section */}
								<div style={{ marginTop: 24 }}>
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
										<BookOutlined style={{ marginRight: 8, color: '#0d6efd' }} />
										<Title level={4} style={{ margin: 0 }}>
											Khóa học đã đăng ký (7)
										</Title>
									</div>

									<Row gutter={[16, 16]}>
										{courses.map((course) => (
											<Col xs={24} sm={12} md={8} key={course.id}>
												<Card hoverable bodyStyle={{ padding: 12 }} style={{ height: '100%' }}>
													<div
														style={{
															background: course.color,
															height: '120px',
															borderRadius: '8px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															marginBottom: '12px',
														}}
													>
														<Title level={4} style={{ color: '#fff', margin: 0, textAlign: 'center' }}>
															{course.title}
														</Title>
													</div>

													<div>
														<Text type='danger' strong>
															Miễn phí
														</Text>
														<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
															<Text type='secondary'>
																<TeamOutlined style={{ marginRight: 4 }} />
																{course.students.toLocaleString()}
															</Text>
															<Text type='secondary'>
																<BookOutlined style={{ marginRight: 4 }} />
																{course.lessons}
															</Text>
															<Text type='secondary'>
																<ClockCircleOutlined style={{ marginRight: 4 }} />
																{course.duration}
															</Text>
														</div>
													</div>
												</Card>
											</Col>
										))}
									</Row>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</Content>
			<Footer />
		</Layout>
	);
};

export default ProfilePage;
