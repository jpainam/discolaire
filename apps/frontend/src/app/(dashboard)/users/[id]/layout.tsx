import Image from "next/image";
import { getServerTranslations } from "@/app/i18n/server";
import { randomAvatar } from "@/components/raw-images";
import { CopyUserIdButton } from "@/components/users/copy-user-id-button";
import { UserSidebarNav } from "@/components/users/user-side-nav";
import { routes } from "@/configs/routes";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Separator } from "@repo/ui/separator";
import {
  BellRing,
  Computer,
  KeySquare,
  LockKeyhole,
  Settings,
  UserIcon,
} from "lucide-react";

type UserLink = {
  icon: React.ReactNode;
  title: string;
  href: string;
};
const randomImage = randomAvatar();
export default async function Layout({
  children,
  params,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  const userLinks: UserLink[] = [
    {
      title: t("profile"),
      href: routes.users.details(params.id),
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      title: t("password"),
      href: routes.users.password(params.id),
      icon: <LockKeyhole className="h-4 w-4" />,
    },
    {
      title: t("roles"),
      href: routes.users.roles(params.id),
      icon: <KeySquare className="h-4 w-4" />,
    },
    {
      title: t("notifications"),
      href: routes.users.notifications(params.id),
      icon: <BellRing className="h-4 w-4" />,
    },
    {
      title: t("settings"),
      href: routes.users.settings(params.id),
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: t("logs_and_activities"),
      href: routes.users.logs(params.id),
      icon: <Computer className="h-4 w-4" />,
    },
  ];
  const session = await getServerAuthSession();
  console.log(session);
  console.log(session);
  const user = session?.user;
  return (
    <div>
      <div className="flex flex-row items-center gap-4 px-4">
        {user?.avatar && (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        {!user?.avatar && (
          <Image
            alt="AV"
            width={100}
            height={100}
            className="rounded-full"
            src={randomImage}
          />
        )}

        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("userManagement")}
            </h2>
            <div className="text-md flex flex-row items-center gap-2 text-muted-foreground">
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
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 px-4 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="w-[200px]">
          <UserSidebarNav items={userLinks} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
