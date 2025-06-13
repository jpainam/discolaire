import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";
import { caller } from "~/trpc/server";
import { SignUpForm } from "./SignUpForm";
const registrationSearchParamsSchema = {
  token: parseAsString,
};

export const registrationSearchParams = createLoader(
  registrationSearchParamsSchema
);

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ userId: string }>;
}
export default async function Page(props: PageProps) {
  const searchParams = await registrationSearchParams(props.searchParams);
  const params = await props.params;
  const { token } = searchParams;

  if (!token) {
    return <div className="text-red-600">Invalid token</div>;
  }
  const user = await caller.user.get(params.userId);

  return <SignUpForm name={user.name} userId={params.userId} token={token} />;
}
