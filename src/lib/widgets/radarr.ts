import type { CommandList } from "~/actions/command";
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
	tmdbId: number;
};

const fetchMovies = async (config: WidgetConfig<"radarr">) =>
	fetch(
		`${config.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${config.apiKey}`,
	).then((res) => {
		if (!res.ok) {
			throw new Error(
				`Failed to fetch Radarr missing movies: ${res.statusText}`,
			);
		}
		return res.json() as Promise<RadarrMissingMoviesResponse>;
	});

export const getWidgetData = async (config: WidgetConfig<"radarr">) => {
	const res = await tryCatch(fetchMovies(config));
	if (res.error) {
		throw res.error;
	}
	return {
		missingMovies: res.data.records
			.map((record) => ({
				id: record.id,
				title: record.title,
				url: `${config.url}/movie/${record.tmdbId}`,
			}))
			.toSorted((a, b) => a.title.localeCompare(b.title)),
	};
};

export const getWidgetCommands = async (
	config: WidgetConfig<"radarr">,
): Promise<CommandList> => {
	const movies = await tryCatch(fetchMovies(config));
	if (movies.error) {
		throw new Error(`Failed to fetch Radarr movies: ${movies.error.message}`);
	}

	return {
		Movies: movies.data.records
			.toSorted((a, b) => a.title.localeCompare(b.title))
			.map((movie) => ({
				name: movie.title,
				url: `${config.url}/movie/${movie.tmdbId}`,
			})),
	};
};
