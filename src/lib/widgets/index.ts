import { z } from "zod";

export const noneSchema = z.object({
	type: z.literal("none"),
	config: z.object({}),
});
export const cupSchema = z.object({
	type: z.literal("cup"),
	config: z.object({
		url: z.url(),
		onlyInUse: z.boolean(),
	}),
});
export const sonarrSchema = z.object({
	type: z.literal("sonarr"),
	config: z.object({
		url: z.url(),
		apiKey: z.string(),
	}),
});
export const radarrSchema = z.object({
	type: z.literal("radarr"),
	config: z.object({
		url: z.url(),
		apiKey: z.string(),
	}),
});
export const uptimeKumaSchema = z.object({
	type: z.literal("uptime-kuma"),
	config: z.object({
		url: z.url(),
		apiKey: z.string(),
	}),
});
export const beszelSchema = z.object({
	type: z.literal("beszel"),
	config: z.object({
		url: z.url(),
		email: z.string(),
		password: z.string(),
	}),
});
export const komodoSchema = z.object({
	type: z.literal("komodo"),
	config: z.object({
		url: z.url(),
		apiKey: z.string(),
		apiSecret: z.string(),
	}),
});
export const nextdnsSchema = z.object({
	type: z.literal("nextdns"),
	config: z.object({
		profile: z.string(),
		apiKey: z.string(),
	}),
});
export const controldSchema = z.object({
	type: z.literal("controld"),
	config: z.object({
		apiKey: z.string(),
	}),
});
export const gatusSchema = z.object({
	type: z.literal("gatus"),
	config: z.object({
		url: z.string(),
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
]);
export type WIDGETS = z.infer<typeof WIDGETS>;
