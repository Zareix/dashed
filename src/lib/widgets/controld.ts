import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type ControlDStatusResponse = {
	success: boolean;
	body: {
		endTime: string;
		startTime: string;
		queries: Array<{
			time: string;
			count: Count;
		}>;
	};
};

type Count = {
	"0": number; // Blocked
	"1": number; // Allowed
	"3": number; // Redirected
	"-1"?: number;
};

export const getWidgetData = async (config: WidgetConfig<"controld">) => {
	const startTime = `${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("Z")[0]}Z`;
	const endTime = `${new Date().toISOString().split("Z")[0]}Z`;
	const res = await tryCatch(
		fetch(
			`https://europe.analytics.controld.com/v2/statistic/timeseries/action?startTime=${startTime}&endTime=${endTime}`,
			{
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			},
		).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch controld data: ${res.statusText}`);
			}
			return res.json() as Promise<ControlDStatusResponse>;
		}),
	);
	if (res.error) {
		console.error("Error fetching ControlD data:", res.error);
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
};
