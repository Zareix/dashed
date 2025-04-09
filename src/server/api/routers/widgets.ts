import { z } from "zod";
import type { CupResponse } from "~/lib/widgets/cup";
import type { RadarrMissingMoviesResponse } from "~/lib/widgets/radarr";
import type {
	SonarrMissingEpisodesResponse,
	SonarrSeriesResponse,
} from "~/lib/widgets/sonarr";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const widgetRouter = createTRPCRouter({
	cup: publicProcedure
		.input(z.object({ url: z.string().url() }))
		.query(async ({ input }) => {
			try {
				const res = await fetch(`${input.url}/api/v3/json`);
				if (res.ok) {
					const data = (await res.json()) as CupResponse;
					return {
						monitoredImages: data.metrics.monitored_images,
						updatesAvailable: data.metrics.updates_available,
						upToDate: data.metrics.up_to_date,
					};
				}
				return null;
			} catch (e) {
				return false;
			}
		}),
	sonarr: publicProcedure
		.input(z.object({ url: z.string().url(), apiKey: z.string() }))
		.query(async ({ input }) => {
			try {
				const [seriesRes, missingRes] = await Promise.all([
					fetch(`${input.url}/api/v3/series?apikey=${input.apiKey}`).then(
						(res) => res.json() as Promise<SonarrSeriesResponse>,
					),
					fetch(
						`${input.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${input.apiKey}`,
					).then((res) => res.json() as Promise<SonarrMissingEpisodesResponse>),
				]);
				return {
					missingSeriesEpisodes: missingRes.records.reduce(
						(acc, cur) => {
							const entry = acc[cur.seriesId];
							if (entry) {
								entry.episodes.push(cur);
							} else {
								acc[cur.seriesId] = {
									seriesTitle:
										seriesRes.find((series) => series.id === cur.seriesId)
											?.title ?? "Unknown",
									episodes: [cur],
								};
							}
							return acc;
						},
						{} as Record<
							SonarrMissingEpisodesResponse["records"][number]["seriesId"],
							{
								seriesTitle: SonarrSeriesResponse[number]["title"];
								episodes: Array<
									SonarrMissingEpisodesResponse["records"][number]
								>;
							}
						>,
					),
				};
			} catch (e) {
				console.log("Error sonarr", e);
				return false;
			}
		}),
	radarr: publicProcedure
		.input(z.object({ url: z.string().url(), apiKey: z.string() }))
		.query(async ({ input }) => {
			try {
				const res = await fetch(
					`${input.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${input.apiKey}`,
				);
				if (res.ok) {
					const data = (await res.json()) as RadarrMissingMoviesResponse;
					return {
						missingMovies: data.records.map((record) => ({
							id: record.id,
							title: record.title,
						})),
					};
				}
				return false;
			} catch (e) {
				console.log("Error sonarr", e);
				return false;
			}
		}),
});
