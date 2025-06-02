declare module Category {
	export interface IRecord {
		id: string;
		name: string;
		description?: string;
		parent_category_id: string | null;
	}
}
