import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type ProwlarrIndexer = {
	id: number;
	name: string;
	enable: boolean;
	protocol: string;
	priority: number;
	added: string;
};

type ProwlarrHealth = {
	source: string;
	type: "ok" | "notice" | "warning" | "error";
	message: string;
	wikiUrl: string;
};

export const getWidgetData = async (config: WidgetConfig<"prowlarr">) => {
	const res = await tryCatch(
		Promise.all([
			fetch(`${config.url}/api/v1/indexer`, {
				headers: {
					"X-Api-Key": config.apiKey,
				},
			}).then((res) => {
				if (!res.ok) {
					throw new Error(
						`Failed to fetch Prowlarr indexers: ${res.statusText}`,
					);
				}
				return res.json() as Promise<ProwlarrIndexer[]>;
			}),
			fetch(`${config.url}/api/v1/health`, {
				headers: {
					"X-Api-Key": config.apiKey,
				},
			}).then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch Prowlarr health: ${res.statusText}`);
				}
				return res.json() as Promise<ProwlarrHealth[]>;
			}),
		]),
	);

	if (res.error) {
		throw res.error;
	}

	const [indexers, health] = res.data;

	const activeIndexers = indexers.filter((indexer) => indexer.enable);
	const unhealthyIndexers = health.filter(
		(h) =>
			(h.type === "error" || h.type === "warning") &&
			h.source.toLowerCase().includes("indexer"),
	);

	return {
		totalIndexers: indexers.length,
		activeIndexers: activeIndexers.length,
		unhealthyIndexers: unhealthyIndexers.map((h) => ({
			source: h.source,
			type: h.type,
			message: h.message,
		})),
		allHealth: health
			.filter((h) => h.type === "error" || h.type === "warning")
			.map((h) => ({
				source: h.source,
				type: h.type,
				message: h.message,
			})),
	};
};
