// Lesson namespace for type definitions
declare module Lesson {
	interface IRecord {
		id: string;
		section_id: number;
		title: string;
		description?: string;
		content_type: 'video' | 'text';
		duration_minutes: number;
		order_number: number;
		is_free_preview: boolean;
		status: 'pending' | 'approved' | 'rejected';
		created_at: string;
		updated_at: string;
	}
}
