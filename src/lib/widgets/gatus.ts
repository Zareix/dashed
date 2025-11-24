import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type GatusStatusesResponse = Array<{
	name: string;
	group: string;
	key: string;
	results: Array<{
		status?: number;
		hostname: string;
		duration: number;
		conditionResults: Array<{
			condition: string;
			success: boolean;
		}>;
		success: boolean;
		timestamp: Date;
	}>;
}>;

export const getWidgetData = async (config: WidgetConfig<"gatus">) => {
	const res = await tryCatch(
		fetch(`${config.url}/api/v1/endpoints/statuses`).then((res) => {
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
};
