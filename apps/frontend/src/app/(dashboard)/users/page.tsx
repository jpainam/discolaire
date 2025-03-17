import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  redirect(`/users/${session.user.id}`);
}
