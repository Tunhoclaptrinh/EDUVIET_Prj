import { Space, Avatar, List, Dropdown, Button, Typography } from 'antd';
import { Link } from 'umi';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import logo from '@/assets/logo-ngang.png';
import React from 'react';

const HeaderBaiHoc = () => {
	const [openNotifications, setOpenNotifications] = React.useState(false);

	// Dữ liệu thông báo
	const notifications = [
		{ title: 'Chia sẻ kinh nghiệm làm việc thực tế', time: '2 giờ trước' },
		{ title: 'Hiệu ứng tích cực từ học trên F8', time: '1 ngày trước' },
	];

	// Danh sách thông báo
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

	return (
		<div
			style={{
				padding: '12px ',
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
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Thêm bóng nhẹ để nổi bật
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

			{/* Thanh tìm kiếm */}
			<div style={{ margin: 'auto' }}>
				<Typography.Title level={5}>
					Cần cù bù siêng lăng (phần này có thể cho một thông điệp ngẫu nhiên)
				</Typography.Title>
			</div>
			{/* Tùy chọn người dùng */}
			<Space>
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
						style={{ fontSize: '18px', color: '#f05123', cursor: 'pointer' }} // Màu biểu tượng chuông
						onClick={() => setOpenNotifications(!openNotifications)}
					/>
				</Dropdown>
				<Avatar
					src='https://avatars.githubusercontent.com/u/146623045?v=4'
					icon={<UserOutlined />}
					style={{ marginRight: 20, border: '2px solid #f05123' }} // Viền avatar màu cam
				/>
			</Space>
		</div>
	);
};

export default HeaderBaiHoc;
