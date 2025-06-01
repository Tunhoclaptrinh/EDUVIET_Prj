declare module BlogPost {
	export interface IRecord {
		id: string;
		title: string;
		excerpt: string;
		thumbnail?: string;
		published_at: string;
		author_id: number;
		category_id: number;
	}
}
