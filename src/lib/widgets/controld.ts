import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type ControlDStatusResponse = {
	success: boolean;
	body: {
		endTs: number;
		startTs: number;
		granularity: string;
		tz: string;
		queries: Array<{
			ts: string;
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
	const yesterdayTs = Date.now() - 24 * 60 * 60 * 1000;
	const res = await tryCatch(
		fetch(
			`https://europe.analytics.controld.com/reports/dns-queries/all-by-verdict/time-series?&startTs=${yesterdayTs}&granularity=hour&tz=Europe%2FLondon`,
			{
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
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
};
