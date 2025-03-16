import { auth } from "@repo/auth";
import { Separator } from "@repo/ui/components/separator";
import { getServerTranslations } from "~/i18n/server";

import { AvatarState } from "~/components/AvatarState";
import { NoPermission } from "~/components/no-permission";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const session = await auth();
  if (session?.user.id !== params.id && session?.user.profile != "staff") {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }

  const { children } = props;

  const { t } = await getServerTranslations();

  const user = session.user;
  return (
    <div>
      <div className="flex flex-row items-center gap-2 px-4 py-2">
        <AvatarState
          pos={1}
          avatar={user.avatar}
          className="w-[100px] h-[100px]"
        />

        <div className="space-y-0.5">
          <h2 className=" font-bold tracking-tight">{t("user_management")}</h2>
          <div className="flex flex-row items-center gap-16">
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <span className="font-bold">{t("name")}</span>
              {user.name}
            </div>
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <span className="font-bold">{t("username")}</span>
              {user.username}
            </div>
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <span className="font-bold">{t("email")}</span>
              {user.email}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("userManagementDescription")}
          </p>
        </div>
      </div>
      <Separator />

      <div className="flex-1">{children}</div>
    </div>
  );
}
