// import NodeCache from "node-cache";

// const cacheSingleton = new NodeCache();

// // A map of cached procedure names to a callable that gives a TTL in seconds
// const cachedProcedures: Map<string, (() => number) | undefined> = new Map();
// cachedProcedures.set("router0.procedure0", () => 2 * 3600); // 2 hours
// cachedProcedures.set("router0.procedure1", () => 1800); // 30 minutes
// cachedProcedures.set("router1.procedure0", secondsUntilMidnight); // dynamic TTL
// cachedProcedures.set("router1.procedure1", () => undefined); // never expires

// const t = initTRPC.create();
// const middlewareMarker = "middlewareMarker" as "middlewareMarker" & {
//   __brand: "middlewareMarker";
// };

// const cacheMiddleware = t.middleware(
//   async ({ ctx, next, path, type, rawInput }) => {
//     if (type !== "query" || !cachedProcedures.has(path)) {
//       return next();
//     }
//     let key = path;
//     if (rawInput) {
//       key += JSON.stringify(rawInput).replace(/\"/g, "'");
//     }
//     const cachedData = cacheSingleton.get(key);
//     if (cachedData) {
//       return {
//         ok: true,
//         data: cachedData,
//         ctx,
//         marker: middlewareMarker,
//       };
//     }
//     const result = await next();

//     //@ts-ignore
//     // data is not defined in the type MiddlewareResult
//     const dataCopy = structuredClone(result.data);

//     const ttlSecondsCallable = cachedProcedures.get(path);
//     if (ttlSecondsCallable) {
//       cacheSingleton.set(key, dataCopy, ttlSecondsCallable());
//     } else {
//       cacheSingleton.set(key, dataCopy);
//     }
//     return result;
//   },
// );

// How to use the cacheMiddleware in your tRPC router
// import cacheMiddleware from "@/app/api/middleware/cache";
// ...
// export const publicProcedure = t.procedure.use(cacheMiddleware);
