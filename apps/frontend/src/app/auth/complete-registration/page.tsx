import type { SearchParams } from "nuqs/server";
import { notFound } from "next/navigation";
import { createLoader, parseAsString } from "nuqs/server";

import { CompleteRegistrationForm } from "./CompleteRegistrationForm";

const searchSchema = {
  token: parseAsString,
  email: parseAsString,
};
const loader = createLoader(searchSchema);

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await loader(props.searchParams);
  if (!searchParams.token) {
    notFound();
  }
  return (
    <CompleteRegistrationForm
      token={searchParams.token}
      email={searchParams.email ?? ""}
    />
  );
}
