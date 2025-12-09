import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type VinceStatsResponse = {
	visitors: number;
	pageviews: number;
	visit_duration: number;
	bounce_rate: number;
};

export const getWidgetData = async (config: WidgetConfig<"vince">) => {
	const siteIds = config.siteIds
		.split(",")
		.map((id) => id.trim())
		.filter((id) => id.length > 0);

	if (siteIds.length === 0) {
		throw new Error("No site IDs provided");
	}

	const sitesResults = await Promise.allSettled(
		siteIds.map(async (siteId) => {
			const statsRes = await tryCatch(
				fetch(
					`${config.url}/api/v1/stats/aggregate?site_id=${encodeURIComponent(siteId)}&period=30d&metrics=visitors,pageviews,visit_duration,bounce_rate`,
					{
						headers: {
							Authorization: `Bearer ${config.apiKey}`,
						},
					},
				).then((res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch Vince stats for ${siteId}: ${res.statusText}`,
						);
					}
					return res.json() as Promise<VinceStatsResponse>;
				}),
			);

			if (statsRes.error) {
				return {
					siteId,
					visitors: 0,
					pageviews: 0,
					visitDuration: 0,
					bounceRate: 0,
				};
			}

			return {
				siteId,
				visitors: statsRes.data.visitors,
				pageviews: statsRes.data.pageviews,
				visitDuration: statsRes.data.visit_duration,
				bounceRate: statsRes.data.bounce_rate,
			};
		}),
	);

	const sites = sitesResults
		.filter(
			(
				result,
			): result is PromiseFulfilledResult<{
				siteId: string;
				visitors: number;
				pageviews: number;
				visitDuration: number;
				bounceRate: number;
			}> => result.status === "fulfilled",
		)
		.map((result) => result.value);

	return sites;
};
