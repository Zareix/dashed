import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type GodoxyRoute = {
	alias: string;
	healthcheck: {
		disable?: boolean;
	};
	health: {
		status: "error" | "healthy" | "napping" | "total" | "unhealthy" | "unknown";
	};
};

type GodoxyResponse = GodoxyRoute[];

export const getWidgetData = async (config: WidgetConfig<"godoxy">) => {
	const { url, password, user } = config;

	const headers: Record<string, string> = {};
	if (user && password) {
		headers.Authorization = `Basic ${btoa(`${user}:${password}`)}`;
	}
	const res = await tryCatch(
		fetch(`${url}/api/v1/route/list`, {
			headers,
		}).then((res) => {
			if (!res.ok) {
				throw new Error("Failed to fetch Godoxy data");
			}
			return res.json() as Promise<GodoxyResponse>;
		}),
	);

	if (res.error) {
		throw res.error;
	}

	return {
		routes: res.data.map((x) => ({
			alias: x.alias,
			health: x.healthcheck.disable ? ("disabled" as const) : x.health.status,
		})),
	};
};
