import { BellRing, LockKeyhole, Settings, UserIcon } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";

import { TabLink } from "~/components/users/tab-link";
import { routes } from "~/configs/routes";

interface UserLink {
  icon: React.ReactNode;
  name: string;
  href: string;
}
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
      name: t("profile"),
      href: routes.users.details(params.id),
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      name: t("password"),
      href: routes.users.password(params.id),
      icon: <LockKeyhole className="h-4 w-4" />,
    },
    {
      name: t("notifications"),
      href: routes.users.notifications(params.id),
      icon: <BellRing className="h-4 w-4" />,
    },
    {
      name: t("settings"),
      href: routes.users.settings(params.id),
      icon: <Settings className="h-4 w-4" />,
    },
  ];
  return (
    <div className="container my-4 flex flex-col space-y-6 p-4">
      <div className="flex max-w-fit items-center rounded-full bg-gray-100">
        {userLinks.map((link: UserLink, index) => {
          return (
            <TabLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              title={link.name}
            />
          );
        })}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
