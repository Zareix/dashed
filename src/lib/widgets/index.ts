import { z } from "astro/zod";

const baseConfig = z.object({
	url: z.string().url().describe("URL"),
});
const withApiKey = baseConfig.extend({
	apiKey: z.string().describe("API Key"),
});
const withUserPass = baseConfig.extend({
	username: z.string(),
	password: z.string(),
});

export const noneSchema = z.object({
	type: z.literal("none"),
	config: z.object({}),
});
export const cupSchema = z.object({
	type: z.literal("cup"),
	config: z.object({
		url: z.string().url(),
		onlyInUse: z.boolean().describe("Only show in-use"),
	}),
});
export const sonarrSchema = z.object({
	type: z.literal("sonarr"),
	config: withApiKey,
});
export const radarrSchema = z.object({
	type: z.literal("radarr"),
	config: withApiKey,
});
export const uptimeKumaSchema = z.object({
	type: z.literal("uptime-kuma"),
	config: withApiKey,
});
export const beszelSchema = z.object({
	type: z.literal("beszel"),
	config: z.object({
		url: z.string().url(),
		email: z.string(),
		password: z.string(),
	}),
});
export const komodoSchema = z.object({
	type: z.literal("komodo"),
	config: z.object({
		url: z.string().url(),
		apiKey: z.string().describe("API Key"),
		apiSecret: z.string().describe("API Secret"),
	}),
});
export const nextdnsSchema = z.object({
	type: z.literal("nextdns"),
	config: z.object({
		profile: z.string(),
		apiKey: z.string().describe("API Key"),
	}),
});
export const controldSchema = z.object({
	type: z.literal("controld"),
	config: z.object({
		apiKey: z.string().describe("API Key"),
	}),
});
export const gatusSchema = z.object({
	type: z.literal("gatus"),
	config: baseConfig,
});
export const godoxySchema = z.object({
	type: z.literal("godoxy"),
	config: baseConfig.extend({
		user: z.string().optional(),
		password: z.string().optional(),
	}),
});
export const subtrackerSchema = z.object({
	type: z.literal("subtracker"),
	config: withApiKey.extend({
		filters: z.string().optional(),
	}),
});
export const karakeepSchema = z.object({
	type: z.literal("karakeep"),
	config: withApiKey,
});
export const kavitaSchema = z.object({
	type: z.literal("kavita"),
	config: withApiKey,
});
export const prowlarrSchema = z.object({
	type: z.literal("prowlarr"),
	config: withApiKey,
});
export const qbittorrentSchema = z.object({
	type: z.literal("qbittorrent"),
	config: withUserPass,
});
export const vinceSchema = z.object({
	type: z.literal("vince"),
	config: withApiKey.extend({
		siteIds: z.string().describe("Site IDs"),
	}),
});
export const proxmoxSchema = z.object({
	type: z.literal("proxmox"),
	config: z.object({
		url: z.string().url(),
		tokenId: z.string().describe("Token ID"),
		tokenSecret: z.string().describe("Token Secret"),
	}),
});
export const traefikSchema = z.object({
	type: z.literal("traefik"),
	config: z.object({
		url: z.string().url(),
		username: z.string().optional(),
		password: z.string().optional(),
	}),
});
export const pocketIdSchema = z.object({
	type: z.literal("pocket-id"),
	config: withApiKey,
});
export const homeAssistantSchema = z.object({
	type: z.literal("home-assistant"),
	config: z.object({
		url: z.string().url().describe("Dashboard URL"),
	}),
});

export const WIDGETS = z.discriminatedUnion("type", [
	noneSchema,
	cupSchema,
	sonarrSchema,
	radarrSchema,
	uptimeKumaSchema,
	beszelSchema,
	komodoSchema,
	nextdnsSchema,
	controldSchema,
	gatusSchema,
	godoxySchema,
	subtrackerSchema,
	karakeepSchema,
	kavitaSchema,
	prowlarrSchema,
	qbittorrentSchema,
	vinceSchema,
	proxmoxSchema,
	traefikSchema,
	pocketIdSchema,
	homeAssistantSchema,
]);
export type WIDGETS = z.infer<typeof WIDGETS>;
export type WidgetConfig<T extends WIDGETS["type"]> = Extract<
	WIDGETS,
	{ type: T }
>["config"];
