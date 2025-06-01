import useInitModel from '@/hooks/useInitModel';
import { type ThongBao } from '@/services/ThongBao/typing';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ThongBao.TReceiver>('courseSections', undefined, undefined, ipLocal);

	return {
		...objInit,
	};
};
