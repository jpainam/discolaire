import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

import { routes } from "~/configs/routes";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  redirect(routes.users.details(session.user.id));
}
