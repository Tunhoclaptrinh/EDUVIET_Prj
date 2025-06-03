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
			// {
			// 	path: '/user',
			// 	redirect: '/user/login',
			// },
			{
				path: '/user/signup',
				layout: false,
				name: 'signup',
				component: './user/SignUp',
			},
		],
	},
	///////////////////////////////////
	// DEFAULT MENU

	{
		path: '/public',
		name: 'Trang Public',
		icon: 'LayoutOutlined',
		routes: [
			{
				path: '/public/trang-chu',
				name: 'Trang Chủ',
				component: './Client/TrangChu',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/khoa-hoc',
				name: 'Khóa Học',
				component: './Client/KhoaHoc',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/khoa-hoc/:id',
				name: 'Khóa Học',
				component: './Client/KhoaHoc',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/trang-ca-nhan',
				name: 'Trang Cá Nhân',
				component: './Client/TrangCaNhan',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/bai-viet',
				name: 'Bài Viết',
				component: './Client/BaiViet',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/bai-viet/chi-tiet/:id',
				name: 'Chi Tiết Bài Viết',
				component: './Client/ChiTietBaiViet',
				icon: 'FileTextOutlined',
				layout: false,
			},
			{
				path: '/public/bai-hoc',
				name: 'Bài Học',
				component: './Client/BaiHoc',
				icon: 'HomeOutlined',
				layout: false,
			},
			// route cho trang bài học
			{
				path: '/public/khoa-hoc/:courseId/bai-hoc/:lessonId?',
				name: 'Bài Học',
				component: './Client/BaiHoc',
				icon: 'HomeOutlined',
				layout: false,
			},
		],
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
		path: '/course',
		name: 'Quản lý khóa học',
		icon: 'LayoutOutlined',
		routes: [
			{
				path: '/course/courses',
				name: 'Các khóa học',
				component: './Manage/Course/Course',
			},
			{
				path: '/course/section',
				name: 'Các chương',
				component: './Manage/Course/CourseSection',
			},
			{
				path: '/course/lesson',
				name: 'Các bài học',
				component: './Manage/Course/Lesson',
			},
			{
				path: '/course/videolesson',
				name: 'Bài học video',
				component: './Manage/Course/VideoLesson',
			},
		],
	},
	{
		path: '/category',
		name: 'QL danh mục',
		component: './Manage/Category',
		icon: 'NotificationOutlined',
	},

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
