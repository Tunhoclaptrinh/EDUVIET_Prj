declare module Course {
	export interface IRecord {
		id: string;
		course_code: string;
		title: string;
		description: string;
		price: number;
		// instructor_id: number;
		instructor: string; // tạm thời lưu tên thôi

		category_id: number;
		thumbnail: string;
		status: 'approved' | 'pending_approval' | 'rejected';
		created_at: string;
		updated_at: string;
		published_at: string | null;
		max_learners: number;
		has_certification: boolean;
		certification_price?: number;
		commission_rate: number;
		enrolled_count: number;
		avg_rating: number | null;
	}
}
