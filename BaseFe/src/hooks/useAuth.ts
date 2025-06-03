import { useState, useEffect } from 'react';
import { useModel, history } from 'umi';
import { message } from 'antd';
import { ipLocal } from '@/utils/ip';

// Define IUser interface based on API response and form fields
interface IUser {
	id: string;
	email: string;
	soDT: string; // Maps to phone_number
	password: string; // API stores hashed password, used for login
	fullName: string;
	ngaySinh?: string; // Maps to birth_year
	gioiTinh?: string;
	preferred_username?: string;
	role?: string;
	profile_picture?: string;
	created_at?: string;
	updated_at?: string;
	last_login?: string;
	auth_provider?: string;
	auth_provider_id?: string | null;
	is_active?: boolean;
	preferred_language?: string;
	ui_theme?: string;
}

interface AuthState {
	user: IUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const useAuth = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	// Check authentication status on initialization
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
				const userId = localStorage.getItem('userId');
				let user: IUser | null = initialState?.currentUser || storedUser;

				if (userId && !user?.id) {
					const response = await fetch(`${ipLocal}/users/${userId}`);
					if (!response.ok) {
						throw new Error('Không thể lấy thông tin người dùng');
					}
					const userData = await response.json();
					// Map API fields to IUser
					user = {
						id: userData.id,
						email: userData.email,
						soDT: userData.phone_number,
						password: userData.password, // Note: Password should be hashed in real API
						fullName: userData.full_name || '',
						ngaySinh: userData.birth_year ? String(userData.birth_year) : undefined,
						gioiTinh: userData.gioiTinh,
						preferred_username: userData.preferred_username,
						role: userData.role,
						profile_picture: userData.profile_picture,
						created_at: userData.created_at,
						updated_at: userData.updated_at,
						last_login: userData.last_login,
						auth_provider: userData.auth_provider,
						auth_provider_id: userData.auth_provider_id,
						is_active: userData.is_active,
						preferred_language: userData.preferred_language,
						ui_theme: userData.ui_theme,
					};
					localStorage.setItem('currentUser', JSON.stringify(user));
					await setInitialState({ currentUser: user });
				}

				setAuthState({
					user,
					isAuthenticated: !!user?.id,
					isLoading: false,
				});
			} catch (error) {
				setAuthState({
					user: null,
					isAuthenticated: false,
					isLoading: false,
				});
			}
		};

		checkAuth();
	}, [initialState, setInitialState]);

	// Login function
	const login = async (login: string, password: string) => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }));

			const response = await fetch(`${ipLocal}/users`);
			if (!response.ok) {
				throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
			}
			const users: IUser[] = await response.json();

			// Find user by email or soDT
			const user = users.find((u: IUser) => (u.email === login || u.soDT === login) && u.password === password);

			if (!user) {
				throw new Error('Thông tin đăng nhập không đúng');
			}

			// Map API fields to IUser
			const userData: IUser = {
				id: user.id,
				email: user.email,
				soDT: user.soDT,
				password: user.password,
				fullName: user.fullName,
				ngaySinh: user.ngaySinh,
				gioiTinh: user.gioiTinh,
				preferred_username: user.preferred_username,
				role: user.role,
				profile_picture: user.profile_picture,
				created_at: user.created_at,
				updated_at: user.updated_at,
				last_login: user.last_login,
				auth_provider: user.auth_provider,
				auth_provider_id: user.auth_provider_id,
				is_active: user.is_active,
				preferred_language: user.preferred_language,
				ui_theme: user.ui_theme,
			};

			localStorage.setItem('userId', user.id);
			localStorage.setItem('currentUser', JSON.stringify(userData));
			await setInitialState({ currentUser: userData });

			setAuthState({
				user: userData,
				isAuthenticated: true,
				isLoading: false,
			});

			message.success('Đăng nhập thành công! Chào mừng bạn đến với hệ thống.');

			// Redirect based on role
			if (user.role === 'admin') {
				history.push('/public/dash-board');
			} else {
				history.push('/public/trang-chu');
			}
		} catch (error: any) {
			setAuthState((prev) => ({ ...prev, isLoading: false }));
			message.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
			throw error;
		}
	};

	// Logout function
	const logout = async () => {
		try {
			setAuthState({ user: null, isAuthenticated: false, isLoading: true });

			localStorage.removeItem('userId');
			localStorage.removeItem('currentUser');
			await setInitialState({ currentUser: null });

			message.success('Đăng xuất thành công');
			history.push('/user/login');
		} catch (error: any) {
			message.error('Đăng xuất thất bại. Vui lòng thử lại.');
		} finally {
			setAuthState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		login,
		logout,
	};
};

export default useAuth;
