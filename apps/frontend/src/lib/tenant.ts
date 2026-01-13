/* eslint-disable @typescript-eslint/no-unused-vars */
//import { env } from "~/env";

export function getSubdomainFromHost(host: string | null): string {
  return "public";
  // const h = host?.split(":")[0]; // strip port
  // if (!h || h === "localhost") {
  //   return env.DEFAULT_TENANT ?? "public";
  // }

  // const parts = h.split(".");
  // if (parts.length <= 2) return "public";

  // if (parts[0]) {
  //   return parts[0].toLowerCase();
  // }
  // return env.DEFAULT_TENANT ?? "public";
}
