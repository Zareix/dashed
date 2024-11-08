import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categoryTable, servicesTable } from "~/server/db/schema";
import { refreshIndexPage } from "~/utils/api";

import yaml from "js-yaml";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categoryTable.findMany({
      with: {
        services: {
          orderBy: [asc(servicesTable.order)],
        },
      },
      orderBy: [asc(categoryTable.order)],
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        maxCols: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categoryTable).values(input);
      refreshIndexPage().catch(console.error);
    }),
  edit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        maxCols: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categoryTable)
        .set(input)
        .where(eq(categoryTable.name, input.name));
      refreshIndexPage().catch(console.error);
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(categoryTable).where(eq(categoryTable.name, input));
    refreshIndexPage().catch(console.error);
  }),
  import: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const parsed = yaml.load(input) as Array<
      Record<
        string,
        Array<
          Record<
            string,
            {
              icon: string;
              href: string;
            }
          >
        >
      >
    >;
    for (let index = 0; index < parsed.length; index++) {
      const category = parsed[index];
      if (!category) continue;
      const _categorykeys = Object.keys(category);
      if (!_categorykeys.length) continue;
      const categoryName = _categorykeys[0];
      if (!categoryName) continue;
      const _categoryvalues = Object.values(category);
      if (!_categoryvalues.length) continue;
      const services = _categoryvalues[0];
      if (!services) continue;

      const catId = (
        await ctx.db
          .insert(categoryTable)
          .values({
            name: categoryName,
            order: index,
          })
          .returning({ name: categoryTable.name })
      )[0]?.name;
      if (!catId) continue;

      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        if (!service) continue;
        const _servicekeys = Object.keys(service);
        if (!_servicekeys.length) continue;
        const serviceName = _servicekeys[0];
        if (!serviceName) continue;
        const _servicevalues = Object.values(service);
        if (!_servicevalues.length) continue;
        const serviceValues = _servicevalues[0];
        if (!serviceValues) continue;

        await ctx.db.insert(servicesTable).values({
          name: serviceName,
          url: serviceValues.href,
          icon: `https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/${serviceName
            .replaceAll(" ", "-")
            .toLowerCase()}.png`,
          categoryName: catId,
          order: i,
        });
      }
    }

    refreshIndexPage().catch(console.error);
  }),
});
