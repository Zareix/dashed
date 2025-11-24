import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type SubtrackerStatsResponse = {
	stats: {
		totalPerMonth: number;
		totalPerYear: number;
		remainingThisMonth: number;
		expectedNextMonth: number;
		totalThisMonth: number;
	};
	currency: {
		code: string;
		symbol: string;
	};
};

export const getWidgetData = async (config: WidgetConfig<"subtracker">) => {
	let searchParams = `?apiKey=${config.apiKey}`;
	if (config.filters && config.filters.length > 0) {
		searchParams = searchParams.concat(`&${config.filters}`);
	}
	const res = await tryCatch(
		fetch(`${config.url}/api/stats${searchParams}`).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Subtracker stats: ${res.statusText}`);
			}
			return res.json() as Promise<SubtrackerStatsResponse>;
		}),
	);
	if (res.error) {
		throw res.error;
	}
	return res.data;
};
