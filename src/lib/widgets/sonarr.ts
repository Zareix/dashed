export type SonarrSeriesResponse = Array<{
	id: number;
	title: string;
}>;

export type SonarrMissingEpisodesResponse = {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: Record[];
};

export type Record = {
	seriesId: number;
	tvdbId: number;
	episodeFileId: number;
	seasonNumber: number;
	episodeNumber: number;
	title: string;
	airDate: Date;
	airDateUtc: Date;
	lastSearchTime?: Date;
	runtime: number;
	overview: string;
	hasFile: boolean;
	monitored: boolean;
	unverifiedSceneNumbering: boolean;
	id: number;
	finaleType?: string;
	absoluteEpisodeNumber?: number;
};
