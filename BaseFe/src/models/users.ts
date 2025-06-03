import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';
import { Login } from '@/services/base/typing';

export default () => {
	const objInt = useInitModel<Login.IUser>('users', undefined, undefined, ipLocal);

	return {
		...objInt,
		dangKy,
	};
};
