import { Contact, FileStack, NotepadTextDashed, Users } from "lucide-react";

import { getServerTranslations } from "~/app/i18n/server";
import { TabLink } from "~/components/users/tab-link";
import { routes } from "~/configs/routes";

type UserLink = {
  icon: React.ReactNode;
  name: string;
  href: string;
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations("admin");
  const userLinks: UserLink[] = [
    {
      name: t("sms_management.history"),
      href: routes.administration.sms_management.history,
      icon: <FileStack className="h-4 w-4" />,
    },
    {
      name: t("sms_management.templates"),
      href: routes.administration.sms_management.templates,
      icon: <NotepadTextDashed className="h-4 w-4" />,
    },
    {
      name: t("sms_management.to_parents"),
      href: routes.administration.sms_management.to_parents,
      icon: <Contact className="h-4 w-4" />,
    },
    {
      name: t("sms_management.to_staffs"),
      href: routes.administration.sms_management.to_staffs,
      icon: <Users className="h-4 w-4" />,
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="m-2 flex max-w-fit items-center rounded-full bg-gray-100">
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
