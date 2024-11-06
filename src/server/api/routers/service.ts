import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { servicesTable } from "~/server/db/schema";
import { getBaseUrl } from "~/utils/api";

const refreshIndexPage = () =>
  fetch(getBaseUrl() + "/api/refresh", {
    method: "POST",
  });

export const serviceRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.servicesTable.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        url: z.string().url(),
        category: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(servicesTable).values(input);
      refreshIndexPage().catch(console.error);
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(servicesTable).where(eq(servicesTable.id, input.id));
      refreshIndexPage().catch(console.error);
    }),
  refresh: publicProcedure.mutation(async () => {
    console.log("Refreshing index page...");
    await refreshIndexPage();
    return { message: "Refreshed index page" };
  }),
});
