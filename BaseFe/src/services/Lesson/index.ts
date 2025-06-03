import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

export async function duyetLesson(lesson: Lesson.IRecord) {
	try {
		const res = await axios.patch(`${ipLocal}/lessons/${lesson.id}`, {
			status: 'approved',
		});
		return res.data;
	} catch (error) {
		console.error('Lỗi duyệt bài học', error);
		throw error;
	}
}
