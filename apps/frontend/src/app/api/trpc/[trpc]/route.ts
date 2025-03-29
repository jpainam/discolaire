import type { TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { appRouter, createTRPCContext } from "@repo/api";
import { auth } from "@repo/auth";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

// const handler = auth(async (req) => {
//   try {
//     const schoolYearId = req.cookies.get("schoolYear")?.value ?? "";
//     const heads = new Headers(req.headers);
//     heads.set("schoolYearId", schoolYearId);
//     const response = await fetchRequestHandler({
//       endpoint: "/api/trpc",
//       router: appRouter,
//       req,
//       createContext: () =>
//         createTRPCContext({
//           session: req.auth,
//           headers: heads,
//         }),
//       onError({ error, path }) {
//         console.error(`>>> tRPC Error on '${path}'`, error);
//         if (error.code == "UNAUTHORIZED") {
//           return Response.redirect(new URL("/auth/login", req.url));
//         }
//       },
//     });

//     setCorsHeaders(response);
//     return response;
//   } catch (e) {
//     console.error(">>> tRPC Error", e);
//     const error = e as TRPCError;
//     if (error.code == "UNAUTHORIZED") {
//       return Response.redirect(new URL("/auth/login", req.url));
//     } else {
//       throw e;
//     }
//   }
// });

const handler = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session) {
      return Response.redirect(new URL("/auth/login", req.url));
    }
    const schoolYearId = req.cookies.get("schoolYear")?.value ?? "";
    const heads = new Headers(req.headers);
    heads.set("schoolYearId", schoolYearId);
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      router: appRouter,
      req,
      createContext: () =>
        createTRPCContext({
          session: session,
          headers: heads,
        }),
      onError({ error, path }) {
        console.error(`>>> tRPC Error on '${path}'`);
        console.error(error.stack);
        console.log(">>> This error is supposed to redirect", error.code);
        if (error.code == "UNAUTHORIZED") {
          console.log("Redirecting to login");
          return Response.redirect(new URL("/auth/login", req.url));
        }
      },
    });

    setCorsHeaders(response);
    return response;
  } catch (e) {
    // TODO remove .stack to any console.error
    // https://www.reddit.com/r/nextjs/comments/1gkxdqe/typeerror_the_payload_argument_must_be_of_type/
    console.error(">>> tRPC Error", (e as Error).stack);
    const error = e as TRPCError;
    if (error.code == "UNAUTHORIZED") {
      return Response.redirect(new URL("/auth/login", req.url));
    } else {
      throw e;
    }
  }
};

export { handler as GET, handler as POST };
