declare module VideoLesson {
	interface IRecord {
		id: string;
		lesson_id: number;
		video_url: string;
		embed_code?: string;
		transcript?: string;
		prevent_skipping: boolean;
		encryption_key?: string;
		created_at: string;
		updated_at: string;
	}
}
