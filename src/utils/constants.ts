import { z } from "zod";

export const AUTHORIZED_DOMAINS = ["cdn.jsdelivr.net"] as const;

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
]);
