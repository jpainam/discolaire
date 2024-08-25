import { authRouter } from "./routers/auth";
import { staffRouter } from "./routers/staff";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  staff: staffRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
