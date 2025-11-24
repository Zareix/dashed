import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type CupResponse = {
	images: Image[];
	last_updated: Date;
	metrics: Metrics;
};

type Image = {
	parts: Parts;
	reference: string;
	result: Result;
	server: string | null;
	time: number;
	url: null | string;
	in_use: boolean;
};

type Parts = {
	registry: Registry;
	repository: string;
	tag: string;
};

type Registry = "registry-1.docker.io" | "docker.n8n.io" | "ghcr.io";

type Result = {
	error: null | string;
	has_update: boolean | null;
	info: Info | null;
};

type Info = {
	current_version?: string;
	new_tag?: string;
	new_version?: string;
	type: Type;
	version_update_type?: VersionUpdateType;
	local_digests?: string[];
	remote_digest?: string;
};

type Type = "version" | "digest";

type VersionUpdateType = "major" | "minor" | "patch";

type Metrics = {
	major_updates: number;
	minor_updates: number;
	monitored_images: number;
	other_updates: number;
	patch_updates: number;
	unknown: number;
	up_to_date: number;
	updates_available: number;
};

export const getWidgetData = async (config: WidgetConfig<"cup">) => {
	const res = await tryCatch(
		fetch(`${config.url}/api/v3/json`).then((res) => {
			if (!res.ok) {
				throw new Error("Failed to fetch CUP data");
			}
			return res.json() as Promise<CupResponse>;
		}),
	);
	if (res.error) {
		throw res.error;
	}

	if (config.onlyInUse) {
		return {
			monitoredImages: res.data.images.filter((x) => x.in_use).length,
			updatesAvailable: res.data.images.filter(
				(x) => x.in_use && x.result.has_update,
			).length,
			upToDate: res.data.images.filter((x) => x.in_use && !x.result.has_update)
				.length,
		};
	}
	return {
		monitoredImages: res.data.metrics.monitored_images,
		updatesAvailable: res.data.metrics.updates_available,
		upToDate: res.data.metrics.up_to_date,
	};
};
