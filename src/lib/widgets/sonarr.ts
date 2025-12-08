import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type SonarrSeriesResponse = Array<{
	id: number;
	title: string;
	titleSlug: string;
}>;

type SonarrMissingEpisodesResponse = {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: SonarrRecord[];
};

type SonarrRecord = {
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

export const getWidgetData = async (config: WidgetConfig<"sonarr">) => {
	const res = await tryCatch(
		Promise.all([
			fetch(`${config.url}/api/v3/series?apikey=${config.apiKey}`).then(
				(res) => res.json() as Promise<SonarrSeriesResponse>,
			),
			fetch(
				`${config.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${config.apiKey}`,
			).then((res) => res.json() as Promise<SonarrMissingEpisodesResponse>),
		]),
	);
	if (res.error) {
		throw new Error(`Failed to fetch Sonarr data: ${res.error.message}`);
	}
	const [seriesRes, missingRes] = res.data;
	return {
		missingSeriesEpisodes: missingRes.records.reduce(
			(acc, cur) => {
				const entry = acc[cur.seriesId];
				if (entry) {
					entry.episodes.push(cur);
				} else {
					const series = seriesRes.find((series) => series.id === cur.seriesId);
					acc[cur.seriesId] = {
						title: series?.title ?? "Unknown",
						url: `${config.url}/series/${series?.titleSlug}`,
						episodes: [cur],
					};
				}
				return acc;
			},
			{} as Record<
				SonarrMissingEpisodesResponse["records"][number]["seriesId"],
				{
					title: SonarrSeriesResponse[number]["title"];
					url: string;
					episodes: Array<SonarrMissingEpisodesResponse["records"][number]>;
				}
			>,
		),
	};
};
