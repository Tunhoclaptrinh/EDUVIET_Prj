import { Row, Col, Typography, Space } from 'antd';
import { YoutubeOutlined, FacebookOutlined } from '@ant-design/icons';
import { ToTopOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Footer = () => {
	return (
		<div
			style={{
				backgroundColor: '#1a1a1a',
				color: '#fff',
				padding: '40px 120px',
				fontSize: '14px',
			}}
		>
			<Row gutter={[16, 16]}>
				{/* Company Name and Contact Info */}
				<Col xs={24} md={6}>
					<Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
						<span style={{ color: '#ff6b6b' }}>EDUVIET</span> Học Thực Hành, Làm Thực Tế
					</Title>
					<Text style={{ color: '#fff' }}>
						Điện thoại: 08 1919 8989
						<br />
						Email:{' '}
						<Link href='mailto:contact@fullstack.edu.vn' style={{ color: '#fff' }}>
							contact@fullstack.edu.vn
						</Link>
						<br />
						Địa chỉ: Số 6/1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội
						<br />
						<div style={{ marginTop: '8px' }}>
							<span
								style={{
									backgroundColor: '#00c4b4',
									color: '#fff',
									padding: '2px 8px',
									borderRadius: '4px',
									fontSize: '12px',
								}}
							>
								DMCA
							</span>
							<span
								style={{
									backgroundColor: '#424242',
									color: '#fff',
									padding: '2px 8px',
									borderRadius: '4px',
									marginLeft: '8px',
									fontSize: '12px',
								}}
							>
								PROTECTED
							</span>
						</div>
					</Text>
				</Col>

				{/* Về EDUVIET Section */}
				<Col xs={24} md={4}>
					<Title level={5} style={{ color: '#fff', marginBottom: '16px' }}>
						VỀ EDUVIET
					</Title>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Giới thiệu
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Liên hệ
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Điều khoản
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Bảo mật
						</Link>
					</div>
				</Col>

				{/* Sản Phẩm Section */}
				<Col xs={24} md={4}>
					<Title level={5} style={{ color: '#fff', marginBottom: '16px' }}>
						SẢN PHẨM
					</Title>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game Nester
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game CSS Diner
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game CSS Selectors
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game Froggy
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game Froggy Pro
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Game Scoops
						</Link>
					</div>
				</Col>

				{/* Công Cụ Section */}
				<Col xs={24} md={4}>
					<Title level={5} style={{ color: '#fff', marginBottom: '16px' }}>
						CÔNG CỤ
					</Title>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Tạo CV xin việc
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Rút gọn link
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Clip-path maker
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Snippet generator
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							CSS GRID generator
						</Link>
						<Link href='#' style={{ color: '#fff', marginBottom: '8px' }}>
							Căn giữa số tay lên mắt
						</Link>
					</div>
				</Col>

				{/* Company Info Section */}
				<Col xs={24} md={6}>
					<Title level={5} style={{ color: '#fff', marginBottom: '16px' }}>
						CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC EDUVIET
					</Title>
					<Text style={{ color: '#fff' }}>
						Mã số thuế: 0109922901
						<br />
						Ngày thành lập: 04/03/2022
						<br />
						Lĩnh vực hoạt động: Giáo dục, công nghệ - lập trình. Chứng tỏi tập trung xây dựng va phát triển các sản phẩm
						mạng là tài trợ cho cộng đồng lập trình viên Việt Nam.
					</Text>
				</Col>
			</Row>

			{/* Copyright and Social Media */}
			<Row style={{ marginTop: '24px', alignItems: 'center' }}>
				<Col xs={24} md={12}>
					<Text style={{ color: '#fff' }}>© 2018 - 2025 EDUVIET. Nền tảng học tập trực tuyến hàng đầu Việt Nam</Text>
				</Col>
				<Col xs={24} md={12} style={{ textAlign: 'right' }}>
					<Space>
						<Link href='#' style={{ color: '#fff' }}>
							<YoutubeOutlined style={{ fontSize: '24px' }} />
						</Link>
						<Link href='#' style={{ color: '#fff' }}>
							<FacebookOutlined style={{ fontSize: '24px' }} />
						</Link>
						<Link href='#' style={{ color: '#fff' }}>
							<ToTopOutlined style={{ fontSize: '24px' }} />
						</Link>
					</Space>
				</Col>
			</Row>
		</div>
	);
};

export default Footer;
