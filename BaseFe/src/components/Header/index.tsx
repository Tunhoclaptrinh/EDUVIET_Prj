import { Button, Input, Space, Avatar, List, Dropdown } from 'antd';
import { Link } from 'umi';
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import logo from '@/assets/logo-ngang.png';
import React from 'react';

const Header = () => {
	const [openNotifications, setOpenNotifications] = React.useState(false);
	const [openCourses, setOpenCourses] = React.useState(false);

	const notifications = [
		{ title: 'Chia sẻ kinh nghiệm làm việc thực tế', time: '2 giờ trước' },
		{ title: 'Hiệu ứng tích cực từ học trên F8', time: '1 ngày trước' },
	];

	const courses = [
		{ title: 'Lập Trình JavaScript Nâng Cao', days: 7, progress: 80 },
		{ title: 'Xây Dựng Website với ReactJS', days: 6, progress: 50 },
		{ title: 'Kiến Thức Nhập Môn IT', days: 9, progress: 100 },
		{ title: 'Lập Trình JavaScript Cơ Bản', days: 10, progress: 90 },
		{ title: 'HTML CSS từ Zero đến Hero', days: 7, progress: 60 },
		{ title: 'Responsive Với Grid System', days: 5, progress: 30 },
		{ title: 'Node & ExpressJS', days: 8, progress: 40 },
	];

	const notificationList = (
		<div style={{ width: 350, maxHeight: 400, overflowY: 'auto', padding: 0 }}>
			<List
				dataSource={notifications}
				renderItem={(item) => (
					<List.Item style={{ padding: '12px 16px' }}>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</div>
								<div style={{ color: '#888', fontSize: 13 }}>{item.time}</div>
							</div>
						</div>
					</List.Item>
				)}
			/>
			<div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
				<Button type='link' onClick={() => setOpenNotifications(false)}>
					Xem tất cả
				</Button>
			</div>
		</div>
	);

	const courseList = (
		<div style={{ width: 350, maxHeight: 400, overflowY: 'auto', padding: 0 }}>
			<List
				dataSource={courses}
				renderItem={(item) => (
					<List.Item style={{ alignItems: 'flex-start', padding: '12px 16px' }}>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div
								style={{
									background: '#f0f0f0',
									borderRadius: '8px',
									padding: '8px 14px',
									fontWeight: 700,
									fontSize: 18,
									marginRight: 16,
									minWidth: 48,
									textAlign: 'center',
									color: '#ff4d4f',
								}}
							>
								{item.title.split(' ')[0][0]}
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</div>
								<div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
									Học cách đây {item.days} ngày - Hoàn thành {item.progress}%
								</div>
								<div style={{ width: '100%', background: '#f0f0f0', borderRadius: '5px', height: 8 }}>
									<div
										style={{
											width: `${item.progress}%`,
											background: '#ff4d4f',
											height: '100%',
											borderRadius: '5px',
											transition: 'width 0.3s',
										}}
									/>
								</div>
							</div>
						</div>
					</List.Item>
				)}
			/>
			<div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
				<Button type='link' onClick={() => setOpenCourses(false)}>
					Xem tất cả
				</Button>
			</div>
		</div>
	);

	return (
		<div
			style={{
				padding: '20px 120px',
				borderBottom: '1px solid #e8e8e8',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				backgroundColor: '#fff',
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
			}}
		>
			{/* Logo */}
			<div>
				<Link
					to='/trang-chu'
					style={{
						color: 'inherit',
						textDecoration: 'none !important',
						padding: '10px',
					}}
				>
					<img src={logo} alt='F8 Logo' style={{ width: '100px', height: '100%' }} />
				</Link>
			</div>

			{/* Search Bar */}
			<div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
				<Input
					placeholder='Tìm kiếm khóa học, bài viết, video...'
					prefix={<SearchOutlined />}
					style={{ borderRadius: '20px', padding: '8px 16px' }}
				/>
			</div>

			{/* User Profile Options */}
			<Space>
				<Dropdown
					visible={openCourses}
					onVisibleChange={setOpenCourses}
					overlay={
						<div
							style={{
								background: '#fff',
								boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
								borderRadius: 8,
								border: '1px solid #f0f0f0',
								padding: 0,
								zIndex: 1100,
							}}
						>
							{courseList}
						</div>
					}
					placement='bottomRight'
					trigger={['click']}
					arrow
				>
					<Link to='/my-courses'>
						<Button
							type='link'
							style={{ color: '#888' }}
							onClick={(e) => {
								e.preventDefault();
								setOpenCourses(!openCourses);
							}}
						>
							Khóa học của tôi
						</Button>
					</Link>
				</Dropdown>
				<Dropdown
					visible={openNotifications}
					onVisibleChange={setOpenNotifications}
					overlay={
						<div
							style={{
								background: '#fff',
								boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
								borderRadius: 8,
								border: '1px solid #f0f0f0',
								padding: 0,
								zIndex: 1100,
							}}
						>
							{notificationList}
						</div>
					}
					placement='bottomRight'
					trigger={['click']}
					arrow
				>
					<BellOutlined
						style={{ fontSize: '18px', color: '#888', cursor: 'pointer' }}
						onClick={() => setOpenNotifications(!openNotifications)}
					/>
				</Dropdown>
				<Avatar
					src='https://avatars.githubusercontent.com/u/146623045?v=4'
					icon={<UserOutlined />}
					style={{ marginRight: 20 }}
				/>
			</Space>
		</div>
	);
};

export default Header;
