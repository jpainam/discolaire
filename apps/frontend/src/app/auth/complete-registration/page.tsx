import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";
import { SignUpForm } from "./SignUpForm";
const registrationSearchParamsSchema = {
  token: parseAsString,
};

export const registrationSearchParams = createLoader(
  registrationSearchParamsSchema,
);

interface PageProps {
  searchParams: Promise<SearchParams>;
}
export default async function Page(props: PageProps) {
  const searchParams = await registrationSearchParams(props.searchParams);
  const { token } = searchParams;

  if (!token) {
    return <div className="text-red-600">Invalid token</div>;
  }
  return <SignUpForm token={token} />;
}
