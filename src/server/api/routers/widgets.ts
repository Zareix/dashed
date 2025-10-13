import {
	beszelSchema,
	controldSchema,
	cupSchema,
	gatusSchema,
	komodoSchema,
	nextdnsSchema,
	radarrSchema,
	sonarrSchema,
	subtrackerSchema,
	uptimeKumaSchema,
} from "~/lib/widgets";
import type {
	BeszelAuthResponse,
	BeszelSystemResponse,
} from "~/lib/widgets/beszel";
import type { ControlDStatusResponse } from "~/lib/widgets/controld";
import type { CupResponse } from "~/lib/widgets/cup";
import type { GatusStatusesResponse } from "~/lib/widgets/gatus";
import type {
	KomodoListServersResponse,
	KomodoListStacksResponse,
} from "~/lib/widgets/komodo";
import type { NextDNSStatusResponse } from "~/lib/widgets/nextdns";
import type { RadarrMissingMoviesResponse } from "~/lib/widgets/radarr";
import type {
	SonarrMissingEpisodesResponse,
	SonarrSeriesResponse,
} from "~/lib/widgets/sonarr";
import type { SubtrackerStatsResponse } from "~/lib/widgets/subtracker";
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
					if (input.onlyInUse) {
						return {
							monitoredImages: data.images.filter((x) => x.in_use).length,
							updatesAvailable: data.images.filter(
								(x) => x.in_use && x.result.has_update,
							).length,
							upToDate: data.images.filter(
								(x) => x.in_use && !x.result.has_update,
							).length,
						};
					}
					return {
						monitoredImages: data.metrics.monitored_images,
						updatesAvailable: data.metrics.updates_available,
						upToDate: data.metrics.up_to_date,
					};
				}
				return null;
			} catch {
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
							temperature: system.info.dt,
						},
						status: system.status,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			} catch (e) {
				console.log("Error beszel", e);
				return false;
			}
		}),
	komodo: publicProcedure
		.input(komodoSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const [listServerResponse, listStacksResponse] = await Promise.all([
					await fetch(`${input.url}/read`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-API-Key": input.apiKey,
							"X-API-Secret": input.apiSecret,
						},
						body: JSON.stringify({
							type: "ListServers",
							params: {},
						}),
					}),
					await fetch(`${input.url}/read`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-API-Key": input.apiKey,
							"X-API-Secret": input.apiSecret,
						},
						body: JSON.stringify({
							type: "ListStacks",
							params: {},
						}),
					}),
				]);
				if (listServerResponse.ok && listStacksResponse.ok) {
					const serversData =
						(await listServerResponse.json()) as KomodoListServersResponse;
					const stacksData =
						(await listStacksResponse.json()) as KomodoListStacksResponse;
					return {
						servers: serversData.map((server) => ({
							id: server.id,
							name: server.name,
							state: server.info.state,
						})),
						stacks: stacksData.map((stack) => ({
							id: stack.id,
							name: stack.name,
							state: stack.info.state,
						})),
					};
				}
				return false;
			} catch (e) {
				console.log("Error komodo", e);
				return false;
			}
		}),
	nextdns: publicProcedure
		.input(nextdnsSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const res = await fetch(
					`https://api.nextdns.io/profiles/${input.profile}/analytics/status`,
					{
						headers: {
							"X-API-Key": input.apiKey,
						},
					},
				);
				if (res.ok) {
					const data = (await res.json()) as NextDNSStatusResponse;
					return {
						allowed: data.data
							.filter((item) => item.status === "allowed")
							.reduce((acc, cur) => acc + cur.queries, 0),
						blocked: data.data
							.filter((item) => item.status === "blocked")
							.reduce((acc, cur) => acc + cur.queries, 0),
						default: data.data
							.filter((item) => item.status === "default")
							.reduce((acc, cur) => acc + cur.queries, 0),
					};
				}
				return false;
			} catch (e) {
				console.log("Error nextdns", e);
				return false;
			}
		}),
	controld: publicProcedure
		.input(controldSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const yesterdayTs = Date.now() - 24 * 60 * 60 * 1000;
				const res = await fetch(
					`https://europe.analytics.controld.com/reports/dns-queries/all-by-verdict/time-series?&startTs=${yesterdayTs}&granularity=hour&tz=Europe%2FLondon`,
					{
						headers: {
							Authorization: `Bearer ${input.apiKey}`,
						},
					},
				);
				if (res.ok) {
					const data = (await res.json()) as ControlDStatusResponse;
					const queries = data.body.queries
						.map((d) => ({
							blocked: d.count[0],
							allowed: d.count[1],
						}))
						.reduce(
							(acc, cur) => ({
								blocked: acc.blocked + cur.blocked,
								allowed: acc.allowed + cur.allowed,
							}),
							{ blocked: 0, allowed: 0 },
						);
					return {
						allowed: queries.allowed,
						blocked: queries.blocked,
						total: queries.allowed + queries.blocked,
					};
				}
				return false;
			} catch (e) {
				console.log("Error controld", e);
				return false;
			}
		}),
	gatus: publicProcedure
		.input(gatusSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const res = await fetch(`${input.url}/api/v1/endpoints/statuses`);
				if (res.ok) {
					const data = (await res.json()) as GatusStatusesResponse;
					return data.map((d) => ({
						name: d.name,
						group: d.group,
						success: d.results.pop()?.success ?? false,
					}));
				}
				return false;
			} catch (e) {
				console.log("Error gatus", e);
				return false;
			}
		}),
	subtracker: publicProcedure
		.input(subtrackerSchema.shape.config)
		.query(async ({ input }) => {
			try {
				const searchParams = new URLSearchParams();
				searchParams.append("apiKey", input.apiKey);
				const res = await fetch(
					`${input.url}/api/stats?${searchParams.toString()}`,
				);
				if (res.ok) {
					return (await res.json()) as SubtrackerStatsResponse;
				}
				return false;
			} catch (e) {
				console.log("Error subtracker", e);
				return false;
			}
		}),
});
