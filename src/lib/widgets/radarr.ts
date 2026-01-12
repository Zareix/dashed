import type { CommandList } from "~/actions/command";
import { tryCatch } from "~/lib/try-catch";
import { camelToTitleCase } from "~/lib/utils";
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

type RadarrHealthResponse = {
	source: string;
	type: "ok" | "notice" | "warning" | "error";
	message: string;
	wikiUrl: string;
};

export type RadarrMovieResponse = {
	id: number;
	title: string;
	originalTitle: string;
	// originalLanguage:      Language;
	// alternateTitles:       AlternateTitle[];
	secondaryYear: number;
	secondaryYearSourceId: number;
	sortTitle: string;
	sizeOnDisk: number;
	status: string;
	overview: string;
	inCinemas: Date;
	physicalRelease: Date;
	digitalRelease: Date;
	releaseDate: Date;
	physicalReleaseNote: string;
	// images:                Image[];
	website: string;
	remotePoster: string;
	year: number;
	youTubeTrailerId: string;
	studio: string;
	path: string;
	qualityProfileId: number;
	hasFile: boolean;
	movieFileId: number;
	monitored: boolean;
	minimumAvailability: string;
	isAvailable: boolean;
	folderName: string;
	runtime: number;
	cleanTitle: string;
	imdbId: string;
	tmdbId: number;
	titleSlug: string;
	rootFolderPath: string;
	folder: string;
	certification: string;
	genres: string[];
	keywords: string[];
	tags: number[];
	added: Date;
	// addOptions:            AddOptions;
	// ratings:               Ratings;
	// movieFile:             MovieFile;
	// collection:            Collection;
	popularity: number;
	lastSearchTime: Date;
	// statistics:            Statistics;
};

export const getWidgetData = async (config: WidgetConfig<"radarr">) => {
	const res = await tryCatch(
		Promise.all([
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
			fetch(`${config.url}/api/v3/health?apikey=${config.apiKey}`).then(
				(res) => res.json() as Promise<RadarrHealthResponse[]>,
			),
		]),
	);
	if (res.error) {
		throw res.error;
	}

	const [missingMoviesRes, healthRes] = res.data;

	const allHealth = healthRes.filter(
		(h) => h.type === "error" || h.type === "warning",
	);

	return {
		missingMovies: missingMoviesRes.records
			.map((record) => ({
				id: record.id,
				title: record.title,
				url: `${config.url}/movie/${record.tmdbId}`,
			}))
			.toSorted((a, b) => a.title.localeCompare(b.title)),
		allHealth,
	};
};

export const getWidgetCommands = async (
	config: WidgetConfig<"radarr">,
): Promise<CommandList> => {
	const movies = await tryCatch(
		fetch(`${config.url}/api/v3/movie?apikey=${config.apiKey}`).then((res) => {
			if (!res.ok) {
				throw new Error(
					`Failed to fetch Radarr missing movies: ${res.statusText}`,
				);
			}
			return res.json() as Promise<RadarrMovieResponse[]>;
		}),
	);
	if (movies.error) {
		console.error(`Failed to fetch Radarr movies: ${movies.error.message}`);
		throw new Error(`Failed to fetch Radarr movies: ${movies.error.message}`);
	}

	return {
		Movies: movies.data
			.toSorted((a, b) => a.title.localeCompare(b.title))
			.map((movie) => ({
				name: movie.title,
				url: `${config.url}/movie/${movie.tmdbId}`,
				information: movie.hasFile
					? "Downloaded"
					: `Missing (${camelToTitleCase(movie.status)})`,
			})),
	};
};
