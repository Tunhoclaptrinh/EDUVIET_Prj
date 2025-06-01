export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/trang-chu',
		name: 'Trang Chủ',
		component: './Client/TrangChu',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/khoa-hoc',
		name: 'Khóa Học',
		component: './Client/KhoaHoc',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/khoa-hoc/:id',
		name: 'Khóa Học',
		component: './Client/KhoaHoc',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/trang-ca-nhan',
		name: 'Trang Cá Nhân',
		component: './Client/TrangCaNhan',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/bai-viet',
		name: 'Bài Viết',
		component: './Client/BaiViet',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/bai-hoc',
		name: 'Bài Học',
		component: './Client/BaiHoc',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
