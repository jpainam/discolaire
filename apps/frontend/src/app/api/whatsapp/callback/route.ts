export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  console.log("url", url);
  return new Response("ok");
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await request.json();
  console.log("body", body);
  console.log("url", url);
  return new Response("ok");
}
