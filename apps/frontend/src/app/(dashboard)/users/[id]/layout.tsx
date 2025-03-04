import { auth } from "@repo/auth";
import { Separator } from "@repo/ui/components/separator";
import { getServerTranslations } from "~/i18n/server";

import { AvatarState } from "~/components/AvatarState";
import { CopyUserIdButton } from "~/components/users/copy-user-id-button";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const { children } = props;

  const { t } = await getServerTranslations();

  const session = await auth();
  const user = session?.user;
  return (
    <div>
      <div className="flex flex-row items-center gap-2 px-4 py-2">
        <AvatarState
          pos={1}
          avatar={user?.avatar}
          className="w-[100px] h-[100px]"
        />

        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-16">
            <h2 className=" font-bold tracking-tight">{t("userManagement")}</h2>
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <span className="font-bold">ID:</span>
              {params.id}
              <CopyUserIdButton userId={params.id} />
            </div>
          </div>
          <p className="text-muted-foreground">
            {t("userManagementDescription")}
          </p>
        </div>
      </div>
      <Separator />

      <div className="flex-1">{children}</div>
    </div>
  );
}
