import { z } from "zod";

export const WIDGETS = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("none"),
		config: z.object({}),
	}),
	z.object({
		type: z.literal("cup"),
		config: z.object({
			url: z.string().url(),
		}),
	}),
	z.object({
		type: z.literal("sonarr"),
		config: z.object({
			url: z.string().url(),
			apiKey: z.string(),
		}),
	}),
	z.object({
		type: z.literal("radarr"),
		config: z.object({
			url: z.string().url(),
			apiKey: z.string(),
		}),
	}),
	z.object({
		type: z.literal("uptime-kuma"),
		config: z.object({
			url: z.string().url(),
			apiKey: z.string(),
		}),
	}),
]);
export type WIDGETS = z.infer<typeof WIDGETS>;
