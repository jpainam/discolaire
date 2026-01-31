import { notFound } from "next/navigation";

import { getSession } from "~/auth/server";
import { MailLayout } from "~/components/users/emails/MailLayout";

export default async function Page() {
  // const params = await props.params;
  const session = await getSession();
  if (!session?.user) {
    notFound();
  }
  return <MailLayout userId={session.user.id} />;
}
