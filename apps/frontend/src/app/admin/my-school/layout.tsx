import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";

import { env } from "~/env";
import { PageHeader } from "../../(dashboard)/administration/PageHeader";
import { CreateSchoolAction } from "./CreateSchoolAction";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;

  return (
    <div className="flex flex-col">
      <PageHeader title={t("my_school")}>
        {user.username == env.SUPER_ADMIN_USERNAME && <CreateSchoolAction />}
      </PageHeader>
      {children}
    </div>
  );
}
