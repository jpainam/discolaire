import { Contact, FileStack, NotepadTextDashed, Users } from "lucide-react";

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
      name: t("attendances"),
      href: routes.students.attendances.index(params.id),
      icon: <FileStack className="h-4 w-4" />,
    },
    {
      name: t("periodic_attendance"),
      href: routes.students.attendances.periodic(params.id),
      icon: <NotepadTextDashed className="h-4 w-4" />,
    },
    {
      name: t("justifications"),
      href: routes.students.attendances.justifications(params.id),
      icon: <Contact className="h-4 w-4" />,
    },
    {
      name: t("summary"),
      href: routes.students.attendances.summary(params.id),
      icon: <Users className="h-4 w-4" />,
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="m-1 flex max-w-fit items-center rounded-full bg-secondary">
        {userLinks.map((link: UserLink, _index) => {
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
