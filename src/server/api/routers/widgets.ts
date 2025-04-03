import { z } from "zod";
import type { CupResponse } from "~/lib/widgets/cup";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const widgetRouter = createTRPCRouter({
	cup: publicProcedure
		.input(z.object({ url: z.string().url() }))
		.query(async ({ input }) => {
			try {
				const res = await fetch(`${input.url}/api/v3/json`);
				if (res.ok) {
					const data = (await res.json()) as CupResponse;
					return {
						monitoredImages: data.metrics.monitored_images,
						updatesAvailable: data.metrics.updates_available,
						upToDate: data.metrics.up_to_date,
					};
				}
				return null;
			} catch (e) {
				return false;
			}
		}),
});
