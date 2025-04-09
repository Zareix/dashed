export type RadarrMissingMoviesResponse = {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: Record[];
};

export type Record = {
	id: number;
	title: string;
};
