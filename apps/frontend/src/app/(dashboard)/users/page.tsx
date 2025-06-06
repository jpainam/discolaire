import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  redirect(`/users/${session.user.id}`);
}
