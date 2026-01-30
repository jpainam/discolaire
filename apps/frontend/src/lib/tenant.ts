import { env } from "~/env";

export function getSubdomainFromHost(host: string | null): string {
  const h = host?.split(":")[0]; // strip port
  const defaultTenant = env.DEFAULT_TENANT ?? "public";
  if (!h || h === "localhost") {
    return defaultTenant;
  }

  const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
  const isLocalIpv4 =
    h.startsWith("127.") || h.startsWith("192.168.") || h.startsWith("10.");
  if (isIpv4 || isLocalIpv4) {
    return defaultTenant;
  }

  const parts = h.split(".");
  if (parts.length <= 2) return defaultTenant;

  if (parts[0]) {
    return parts[0].toLowerCase();
  }
  return defaultTenant;
}
