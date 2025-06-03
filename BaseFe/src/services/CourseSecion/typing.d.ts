declare namespace CourseSection {
	interface IRecord {
		id: string | number;
		course_id: string | number;
		title: string;
		description?: string;
		order_number: number;
		created_at?: string;
		updated_at?: string;
	}

	interface ISearchParams {
		title?: string;
		course_id?: string | number;
		order_number?: number;
		page?: number;
		pageSize?: number;
	}

	interface ICreateRequest {
		course_id: string | number;
		title: string;
		description?: string;
		order_number: number;
	}

	interface IUpdateRequest extends ICreateRequest {
		id: string | number;
	}
}
