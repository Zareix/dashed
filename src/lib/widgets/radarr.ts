import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type RadarrMissingMoviesResponse = {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: Record[];
};

type Record = {
	id: number;
	title: string;
};

export const getWidgetData = async (config: WidgetConfig<"radarr">) => {
	const res = await tryCatch(
		fetch(
			`${config.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${config.apiKey}`,
		).then((res) => {
			if (!res.ok) {
				throw new Error(
					`Failed to fetch Radarr missing movies: ${res.statusText}`,
				);
			}
			return res.json() as Promise<RadarrMissingMoviesResponse>;
		}),
	);
	if (res.error) {
		throw res.error;
	}
	return {
		missingMovies: res.data.records
			.map((record) => ({
				id: record.id,
				title: record.title,
			}))
			.sort((a, b) => a.title.localeCompare(b.title)),
	};
};
