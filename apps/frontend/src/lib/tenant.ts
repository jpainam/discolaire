export function getSubdomainFromHost(host: string | null): string {
  if (!host) return "public";

  const h = host.split(":")[0]; // strip port
  if (h?.includes("localhost") || h?.includes("127.0.0.1")) return "public";

  const parts = h?.split(".");
  if (parts && parts.length >= 3) {
    return parts[0]?.toLowerCase() ?? "public";
  }
  return "public";
}
