import type { SearchParams } from "nuqs/server";
import { notFound } from "next/navigation";
import { createLoader, parseAsString } from "nuqs/server";

import { ResetPasswordForm } from "./ResetPasswordForm";

const searchSchema = {
  token: parseAsString,
};
const resetPasswordLoader = createLoader(searchSchema);
export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await resetPasswordLoader(props.searchParams);
  if (!searchParams.token) {
    notFound();
  }
  return <ResetPasswordForm token={searchParams.token} />;
}
