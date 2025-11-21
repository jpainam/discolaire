export function getSubdomainFromHost(host: string | null): string {
  if (!host) return "public";

  const h = host.split(":")[0]; // strip port
  const parts = h?.split(".");
  if (parts) {
    return parts[0]?.toLowerCase() ?? "public";
  }
  return "public";
}
