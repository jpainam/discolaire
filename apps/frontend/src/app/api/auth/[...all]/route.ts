import { getAuth } from "~/auth/server";

export const GET = async (req: Request) => {
  const auth = await getAuth(new Headers(req.headers));
  return auth.handler(req);
};
export const POST = async (req: Request) => {
  const auth = await getAuth(new Headers(req.headers));
  return auth.handler(req);
};
