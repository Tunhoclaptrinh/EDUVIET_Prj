import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

export async function duyetCourse(course: Course.IRecord) {
	try {
		const res = await axios.patch(`${ipLocal}/courses/${course.id}`, {
			status: 'approved',
		});
		return res.data;
	} catch (error) {
		console.error('Lỗi duyệt khóa học:', error);
		throw error;
	}
}
