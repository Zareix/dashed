import { z } from "zod";
import {
	WIDGETS,
	beszelSchema,
	cupSchema,
	radarrSchema,
	sonarrSchema,
	uptimeKumaSchema,
} from "~/lib/widgets";
import type {
	BeszelAuthResponse,
	BeszelSystemResponse,
} from "~/lib/widgets/beszel";
import type { CupResponse } from "~/lib/widgets/cup";
import type { RadarrMissingMoviesResponse } from "~/lib/widgets/radarr";
import type {
	SonarrMissingEpisodesResponse,
	SonarrSeriesResponse,
} from "~/lib/widgets/sonarr";
import { parseMonitorStatusFromMetrics } from "~/lib/widgets/uptime-kuma";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const widgetRouter = createTRPCRouter({
	cup: publicProcedure
		.input(cupSchema.shape.config)
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
		.input(sonarrSchema.shape.config)
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
		.input(radarrSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const res = await fetch(
					`${input.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${input.apiKey}`,
				);
				if (res.ok) {
					const data = (await res.json()) as RadarrMissingMoviesResponse;
					return {
						missingMovies: data.records
							.map((record) => ({
								id: record.id,
								title: record.title,
							}))
							.sort((a, b) => a.title.localeCompare(b.title)),
					};
				}
				return false;
			} catch (e) {
				console.log("Error sonarr", e);
				return false;
			}
		}),
	uptimeKuma: publicProcedure
		.input(uptimeKumaSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const res = await fetch(`${input.url}/metrics`, {
					headers: {
						Authorization: `Basic ${Buffer.from(`:${input.apiKey}`).toString("base64")}`,
					},
				});
				if (res.ok) {
					const metrics = await res.text();
					const parseMetrics = parseMonitorStatusFromMetrics(metrics);
					return {
						metrics: parseMetrics,
					};
				}
				console.log("Error uptimeKuma", res);
				return false;
			} catch (e) {
				console.log("Error uptimeKuma", e);
				return false;
			}
		}),
	beszel: publicProcedure
		.input(beszelSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const res = await fetch(
					`${input.url}/api/collections/users/auth-with-password`,
					{
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							identity: input.email,
							password: input.password,
						}),
					},
				)
					.then(async (res) => {
						if (res.ok) {
							return res.json() as Promise<BeszelAuthResponse>;
						}
						throw new Error(`Login failed : ${await res.text()}`);
					})
					.then((auth) =>
						fetch(
							`${input.url}/api/collections/systems/records?page=1&perPage=500&skipTotal=1&sort=+name&fields=id,name,host,port,info,status`,
							{
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${auth.token}`,
								},
							},
						),
					)
					.then((res) => {
						if (res.ok) {
							return res.json() as Promise<BeszelSystemResponse>;
						}
						throw new Error("Failed to fetch systems");
					});
				return res.items
					.map((system) => ({
						id: system.id,
						name: system.name,
						host: system.host,
						info: {
							cpuUsagePercent: system.info.cpu,
							memoryUsagePercent: system.info.mp,
							diskUsagePercent: system.info.dp,
						},
						status: system.status,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			} catch (e) {
				console.log("Error beszel", e);
				return false;
			}
		}),
});
