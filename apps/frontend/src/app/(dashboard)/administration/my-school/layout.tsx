import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";

import { env } from "~/env";
import { CreateSchoolAction } from "./CreateSchoolAction";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Label>{t("my_school")}</Label>
        {user.username == env.SUPER_ADMIN_USERNAME && <CreateSchoolAction />}
      </div>
      {children}
    </div>
  );
}
