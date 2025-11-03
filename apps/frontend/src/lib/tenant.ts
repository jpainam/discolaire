export function getSubdomainFromHost(host: string | null): string {
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "public";
  }
  const parts = host.split(".");
  if (parts.length >= 3) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return parts[0]!;
  }
  return "public";
}
