import logo from '@/assets/logo-ngang.png';
import { Menu, Button, Drawer } from 'antd';
import { SoundFilled, TagsOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import React, { useState } from 'react';

interface NavItem {
	key: string;
	icon: React.ReactNode;
	text: string;
	to: string;
}

interface SidebarProps {
	stickerOpacity?: number;
	navItems?: NavItem[];
	onVoiceClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems = [], onVoiceClick = () => {}, stickerOpacity = 1 }) => {
	const [visible, setVisible] = useState(false);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	return (
		<>
			{/* Sticker Button */}
			<Button
				type='primary'
				onClick={showDrawer}
				style={{
					position: 'fixed',
					left: 0,
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 999,
					borderRadius: '0 4px 4px 0',
					height: '50px',
					width: '40px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
					backgroundColor: '#ff6b6b',
					border: 'none',
					opacity: `${stickerOpacity}`,
				}}
				icon={<TagsOutlined />}
			/>

			{/* Drawer that opens when clicking the sticker */}
			<Drawer
				title='Điều hướng'
				placement='left'
				onClose={onClose}
				visible={visible}
				width={200}
				bodyStyle={{ padding: '10px 0' }}
			>
				<div
					style={{
						textAlign: 'center',
						marginBottom: '20px',
						backgroundImage: `url(${logo})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						height: '40px',
						backgroundSize: 'contain',
						marginTop: '10px',
					}}
				></div>
				<Menu mode='inline' style={{ border: 'none' }}>
					{navItems.map((item) => (
						<Menu.Item
							key={item.key}
							onClick={onClose}
							style={{
								height: 110,
								padding: 0,
								margin: '12px 0',
								background: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							icon={null}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									width: '100%',
									padding: 16,
								}}
							>
								<span
									style={{
										marginBottom: 8,
										lineHeight: 1,
										display: 'block',
										textAlign: 'center',
									}}
								>
									{React.cloneElement(item.icon as React.ReactElement, { style: { fontSize: 24 } })}
								</span>
								<Link
									to={item.to}
									style={{
										fontSize: 20,
										color: 'inherit',
										textAlign: 'center',
										display: 'block',
										fontWeight: 600,
										lineHeight: 1.2,
									}}
								>
									{item.text}
								</Link>
							</div>
						</Menu.Item>
					))}
				</Menu>

				<div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center' }}>
					<Button
						type='text'
						icon={<SoundFilled />}
						style={{ fontSize: '20px', color: '#888' }}
						onClick={onVoiceClick}
					/>
				</div>
			</Drawer>
		</>
	);
};

export default Sidebar;
