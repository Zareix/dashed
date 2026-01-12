import { tryCatch } from "~/lib/try-catch";
import { camelToTitleCase } from "~/lib/utils";
import type { WidgetConfig } from ".";

type OverviewDetails = {
	routers: {
		total: number;
		warnings: number;
		errors: number;
	};
	services: { total: number; warnings: number; errors: number };
	middlewares: { total: number; warnings: number; errors: number };
};

type Overview = {
	http: OverviewDetails;
	tcp: OverviewDetails;
	udp: Omit<OverviewDetails, "middlewares">;
};

export async function getWidgetData(config: WidgetConfig<"traefik">) {
	const headers = new Headers();
	if (config.username && config.password) {
		headers.set(
			"Authorization",
			`Basic ${btoa(`${config.username}:${config.password}`)}`,
		);
	}

	const res = await tryCatch(
		fetch(`${config.url}/api/overview`, { headers }).then(
			(res) => res.json() as Promise<Overview>,
		),
	);

	if (res.error) {
		console.error("Error fetching traefik data:", res.error);
		throw new Error(`Failed to fetch traefik data: ${res.error.message}`);
	}
	const overview = res.data;

	const alerts: Array<{
		type: "info" | "warning" | "error";
		source: string;
		message: string;
	}> = [];

	for (const proto of ["http", "tcp", "udp"] as const) {
		for (const component of ["routers", "services", "middlewares"] as const) {
			const details = overview[proto];
			if (!("middlewares" in details)) continue;
			const componentDetails = details[component];
			if (!componentDetails) continue;
			if ("warnings" in componentDetails && componentDetails.warnings > 0) {
				alerts.push({
					type: "warning",
					source: `${proto.toUpperCase()}`,
					message: `There are ${componentDetails.warnings} ${camelToTitleCase(
						component,
					)} warnings.`,
				});
			}
			if ("errors" in componentDetails && componentDetails.errors > 0) {
				alerts.push({
					type: "error",
					source: `${proto.toUpperCase()}`,
					message: `There are ${componentDetails.errors} ${camelToTitleCase(component)} errors.`,
				});
			}
		}
	}
	return {
		routers:
			overview.http.routers.total +
			overview.tcp.routers.total +
			overview.udp.routers.total,
		services:
			overview.http.services.total +
			overview.tcp.services.total +
			overview.udp.services.total,
		middlewares:
			overview.http.middlewares.total + overview.tcp.middlewares.total,
		alerts,
	};
}
