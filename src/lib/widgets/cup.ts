export type CupResponse = {
	images: Image[];
	last_updated: Date;
	metrics: Metrics;
};

export type Image = {
	parts: Parts;
	reference: string;
	result: Result;
	server: string | null;
	time: number;
	url: null | string;
};

export type Parts = {
	registry: Registry;
	repository: string;
	tag: string;
};

export type Registry = "registry-1.docker.io" | "docker.n8n.io" | "ghcr.io";

export type Result = {
	error: null | string;
	has_update: boolean | null;
	info: Info | null;
};

export type Info = {
	current_version?: string;
	new_tag?: string;
	new_version?: string;
	type: Type;
	version_update_type?: VersionUpdateType;
	local_digests?: string[];
	remote_digest?: string;
};

export type Type = "version" | "digest";

export type VersionUpdateType = "major" | "minor" | "patch";

export type Metrics = {
	major_updates: number;
	minor_updates: number;
	monitored_images: number;
	other_updates: number;
	patch_updates: number;
	unknown: number;
	up_to_date: number;
	updates_available: number;
};
