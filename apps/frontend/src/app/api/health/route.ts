export const dynamic = "force-static";
// eslint-disable-next-line @typescript-eslint/require-await
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
