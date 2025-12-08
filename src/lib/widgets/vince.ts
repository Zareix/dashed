import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type VinceSitesResponse = Array<{
	domain: string;
	timezone: string;
}>;

type VinceStatsResponse = {
	results: {
		visitors: {
			value: number;
		};
		pageviews: {
			value: number;
		};
		visit_duration: {
			value: number;
		};
		bounce_rate: {
			value: number;
		};
	};
};

export const getWidgetData = async (config: WidgetConfig<"vince">) => {
	// First, fetch the list of sites
	const sitesRes = await tryCatch(
		fetch(`${config.url}/api/v1/sites`, {
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Vince sites: ${res.statusText}`);
			}
			return res.json() as Promise<VinceSitesResponse>;
		}),
	);

	if (sitesRes.error) {
		throw sitesRes.error;
	}

	// For each site, fetch basic stats (last 30 days)
	const sites = await Promise.all(
		sitesRes.data.map(async (site) => {
			const statsRes = await tryCatch(
				fetch(
					`${config.url}/api/v1/stats/aggregate?site_id=${site.domain}&period=30d&metrics=visitors,pageviews,visit_duration,bounce_rate`,
					{
						headers: {
							Authorization: `Bearer ${config.apiKey}`,
						},
					},
				).then((res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch Vince stats for ${site.domain}: ${res.statusText}`,
						);
					}
					return res.json() as Promise<VinceStatsResponse>;
				}),
			);

			if (statsRes.error) {
				return {
					domain: site.domain,
					visitors: 0,
					pageviews: 0,
					visitDuration: 0,
					bounceRate: 0,
				};
			}

			return {
				domain: site.domain,
				visitors: statsRes.data.results.visitors.value,
				pageviews: statsRes.data.results.pageviews.value,
				visitDuration: statsRes.data.results.visit_duration.value,
				bounceRate: statsRes.data.results.bounce_rate.value,
			};
		}),
	);

	return sites;
};
