export function getSubdomainFromHost(host: string | null): string {
  if (!host) return "public";

  const h = host.split(":")[0]; // strip port
  if (!h || h === "localhost") return "public";

  const parts = h.split(".");
  if (parts.length <= 2) return "public";

  if (parts[0]) {
    return parts[0].toLowerCase();
  }
  return "public";
}
