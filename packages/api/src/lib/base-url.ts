export function getBaseUrlFromHeaders(
  requestHeaders: Headers,
  fallback = `http://localhost:${process.env.PORT ?? 3000}`,
) {
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (host) {
    return `${protocol}://${host}`;
  }

  return fallback;
}
