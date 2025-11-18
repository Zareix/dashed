import { defineAction } from "astro:actions";
import { tryCatch } from "~/lib/try-catch";
import {
	beszelSchema,
	controldSchema,
	cupSchema,
	gatusSchema,
	karakeepSchema,
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
import type { KarakeepListsResponse } from "~/lib/widgets/karakeep";
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

export const widget = {
	beszel: defineAction({
		input: beszelSchema.shape.config,
		handler: async (input) => {
			try {
				const auth = await tryCatch(
					fetch(`${input.url}/api/collections/users/auth-with-password`, {
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							identity: input.email,
							password: input.password,
						}),
					}).then(async (res) => {
						if (res.ok) {
							return res.json() as Promise<BeszelAuthResponse>;
						}
						throw new Error(`Login failed : ${await res.text()}`);
					}),
				);
				if (auth.error) {
					throw auth.error;
				}

				const res = await tryCatch(
					fetch(
						`${input.url}/api/collections/systems/records?page=1&perPage=500&skipTotal=1&sort=+name&fields=id,name,host,port,info,status`,
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${auth.data.token}`,
							},
						},
					).then((res) => {
						if (res.ok) {
							return res.json() as Promise<BeszelSystemResponse>;
						}
						throw new Error("Failed to fetch systems");
					}),
				);
				if (res.error) {
					throw res.error;
				}
				return res.data.items
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
				return null;
			}
		},
	}),
	controld: defineAction({
		input: controldSchema.shape.config,
		handler: async (input) => {
			try {
				const yesterdayTs = Date.now() - 24 * 60 * 60 * 1000;
				const res = await tryCatch(
					fetch(
						`https://europe.analytics.controld.com/reports/dns-queries/all-by-verdict/time-series?&startTs=${yesterdayTs}&granularity=hour&tz=Europe%2FLondon`,
						{
							headers: {
								Authorization: `Bearer ${input.apiKey}`,
							},
						},
					).then((res) => {
						if (!res.ok) {
							throw new Error("Failed to fetch controld data");
						}
						return res.json() as Promise<ControlDStatusResponse>;
					}),
				);
				if (res.error) {
					throw res.error;
				}

				const queries = res.data.body.queries
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
			} catch (e) {
				console.log("Error controld", e);
				return null;
			}
		},
	}),
	cup: defineAction({
		input: cupSchema.shape.config,
		handler: async (input) => {
			try {
				const res = await tryCatch(
					fetch(`${input.url}/api/v3/json`).then((res) => {
						if (!res.ok) {
							throw new Error("Failed to fetch CUP data");
						}
						return res.json() as Promise<CupResponse>;
					}),
				);
				if (res.error) {
					throw res.error;
				}

				if (input.onlyInUse) {
					return {
						monitoredImages: res.data.images.filter((x) => x.in_use).length,
						updatesAvailable: res.data.images.filter(
							(x) => x.in_use && x.result.has_update,
						).length,
						upToDate: res.data.images.filter(
							(x) => x.in_use && !x.result.has_update,
						).length,
					};
				}
				return {
					monitoredImages: res.data.metrics.monitored_images,
					updatesAvailable: res.data.metrics.updates_available,
					upToDate: res.data.metrics.up_to_date,
				};
			} catch {
				return null;
			}
		},
	}),
	gatus: defineAction({
		input: gatusSchema.shape.config,
		handler: async (input) => {
			try {
				const res = await tryCatch(
					fetch(`${input.url}/api/v1/endpoints/statuses`).then((res) => {
						if (!res.ok) {
							throw new Error("Failed to fetch Gatus data");
						}
						return res.json() as Promise<GatusStatusesResponse>;
					}),
				);
				if (res.error) {
					throw res.error;
				}

				return res.data.map((d) => ({
					name: d.name,
					group: d.group,
					success: d.results.pop()?.success ?? false,
				}));
			} catch (e) {
				console.log("Error gatus", e);
				return null;
			}
		},
	}),
	karakeep: defineAction({
		input: karakeepSchema.shape.config,
		handler: async (input) => {
			try {
				const res = await tryCatch(
					fetch(`${input.url}/api/v1/lists`, {
						headers: {
							Authorization: `Bearer ${input.apiKey}`,
						},
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch karakeep lists: ${res.statusText}`,
							);
						}
						return res.json() as Promise<KarakeepListsResponse>;
					}),
				);
				if (res.error) {
					throw res.error;
				}

				return {
					lists: res.data.lists,
				};
			} catch (e) {
				console.log("Error karakeep", e);
				return null;
			}
		},
	}),
	komodo: defineAction({
		input: komodoSchema.shape.config,
		handler: async (input) => {
			const res = await tryCatch(
				Promise.all([
					fetch(`${input.url}/read`, {
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
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch komodo servers: ${res.statusText}`,
							);
						}
						return res.json() as Promise<KomodoListServersResponse>;
					}),
					fetch(`${input.url}/read`, {
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
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch komodo stacks: ${res.statusText}`,
							);
						}
						return res.json() as Promise<KomodoListStacksResponse>;
					}),
				]),
			);
			if (res.error) {
				throw res.error;
			}
			const [serversData, stacksData] = res.data;
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
		},
	}),
	nextdns: defineAction({
		input: nextdnsSchema.shape.config,
		handler: async (input) => {
			const res = await tryCatch(
				fetch(
					`https://api.nextdns.io/profiles/${input.profile}/analytics/status`,
					{
						headers: {
							"X-API-Key": input.apiKey,
						},
					},
				).then((res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch NextDNS status: ${res.statusText}`,
						);
					}
					return res.json() as Promise<NextDNSStatusResponse>;
				}),
			);
			if (res.error) {
				throw res.error;
			}

			return {
				allowed: res.data.data
					.filter((item) => item.status === "allowed")
					.reduce((acc, cur) => acc + cur.queries, 0),
				blocked: res.data.data
					.filter((item) => item.status === "blocked")
					.reduce((acc, cur) => acc + cur.queries, 0),
				default: res.data.data
					.filter((item) => item.status === "default")
					.reduce((acc, cur) => acc + cur.queries, 0),
			};
		},
	}),
	radarr: defineAction({
		input: radarrSchema.shape.config,
		handler: async (input) => {
			const res = await tryCatch(
				fetch(
					`${input.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${input.apiKey}`,
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
		},
	}),
	sonarr: defineAction({
		input: sonarrSchema.shape.config,
		handler: async (input) => {
			const res = await tryCatch(
				Promise.all([
					fetch(`${input.url}/api/v3/series?apikey=${input.apiKey}`).then(
						(res) => res.json() as Promise<SonarrSeriesResponse>,
					),
					fetch(
						`${input.url}/api/v3/wanted/missing?page=1&pageSize=100&includeSeries=false&includeImages=false&monitored=true&apikey=${input.apiKey}`,
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
							episodes: Array<SonarrMissingEpisodesResponse["records"][number]>;
						}
					>,
				),
			};
		},
	}),
	subtracker: defineAction({
		input: subtrackerSchema.shape.config,
		handler: async (input) => {
			let searchParams = `?apiKey=${input.apiKey}`;
			if (input.filters && input.filters.length > 0) {
				searchParams = searchParams.concat(`&${input.filters}`);
			}
			const res = await tryCatch(
				fetch(`${input.url}/api/stats${searchParams}`).then((res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch Subtracker stats: ${res.statusText}`,
						);
					}
					return res.json() as Promise<SubtrackerStatsResponse>;
				}),
			);
			if (res.error) {
				throw res.error;
			}
			return res.data;
		},
	}),
	"uptime-kuma": defineAction({
		input: uptimeKumaSchema.shape.config,
		handler: async (input) => {
			const res = await tryCatch(
				fetch(`${input.url}/metrics`, {
					headers: {
						Authorization: `Basic ${Buffer.from(`:${input.apiKey}`).toString("base64")}`,
					},
				}).then(async (res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch Uptime Kuma metrics: ${await res.text()}`,
						);
					}
					return res.text();
				}),
			);
			if (res.error) {
				throw res.error;
			}

			const parseMetrics = parseMonitorStatusFromMetrics(res.data);
			return {
				metrics: parseMetrics,
			};
		},
	}),
};
