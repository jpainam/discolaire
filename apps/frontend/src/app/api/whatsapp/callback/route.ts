export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  console.log("url", url);
  return new Response("ok");
}
