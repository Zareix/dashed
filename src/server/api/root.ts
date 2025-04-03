import { categoryRouter } from "~/server/api/routers/category";
import { healthRouter } from "~/server/api/routers/health";
import { serviceRouter } from "~/server/api/routers/service";
import { widgetRouter } from "~/server/api/routers/widgets";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	health: healthRouter,
	service: serviceRouter,
	category: categoryRouter,
	widget: widgetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
