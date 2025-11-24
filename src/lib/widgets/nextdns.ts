import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type NextDNSStatusResponse = {
	data: Array<{
		status: "default" | "blocked" | "allowed";
		queries: number;
	}>;
};

export const getWidgetData = async (config: WidgetConfig<"nextdns">) => {
	const res = await tryCatch(
		fetch(
			`https://api.nextdns.io/profiles/${config.profile}/analytics/status`,
			{
				headers: {
					"X-API-Key": config.apiKey,
				},
			},
		).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch NextDNS status: ${res.statusText}`);
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
};
