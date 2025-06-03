declare module VideoLesson {
	interface IRecord {
		id: string | number;
		lesson_id?: string | number;
		video_url?: string;
		embed_code?: string | null;
		transcript?: string | null;
		prevent_skipping?: boolean;
		encryption_key?: string | null;
		created_at: string;
		updated_at: string;
	}
}
