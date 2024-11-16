import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const healthRouter = createTRPCRouter({
	health: publicProcedure.query(async ({ ctx }) => {
		return {
			status: "ok",
		};
	}),
});
