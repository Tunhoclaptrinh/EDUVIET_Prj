import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';
import { Login } from '../base/typing';

// Giả api lập đăng ký
export async function dangKy(users: Login.IUser) {
	return axios.post(`${ipLocal}/users`, {
		...users,
		ngayCap: null,
		noiCap: null,
		hoKhauThuongTru: {
			tinh_ThanhPho: null,
			quanHuyen: null,
			xaPhuong: null,
			diaChi: null,
		},
	});
}
