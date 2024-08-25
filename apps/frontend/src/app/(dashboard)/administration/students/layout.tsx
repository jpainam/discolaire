import { getServerTranslations } from "@/app/i18n/server";
import { TabLink } from "@/components/users/tab-link";
import { routes } from "@/configs/routes";
import { SquareArrowLeft, Upload, Users } from "lucide-react";

type UserLink = {
  icon: React.ReactNode;
  name: string;
  href: string;
};
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
      name: t("allStudents"),
      href: routes.administration.students.index,
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: t("importStudents"),
      href: routes.administration.students.import,
      icon: <Upload className="h-4 w-4" />,
    },
    {
      name: t("excludedStudents"),
      href: routes.administration.students.excluded,
      icon: <SquareArrowLeft className="h-4 w-4" />,
    },
  ];
  return (
    <div className="my-4 container flex flex-col space-y-6 p-4">
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
