"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Separator } from "@repo/ui/components/separator";

import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

export function HealthHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { createQueryString } = useCreateQueryString();
  const healthLinks: { label: string; href: string }[] = [
    {
      label: t("notes"),
      href: routes.students.health.index(params.id),
    },
    {
      label: t("health_issues"),
      href: routes.students.health.health_issues(params.id),
    },
    {
      label: t("drugs"),
      href: routes.students.health.drugs(params.id),
    },
    {
      label: t("immunizations"),
      href: routes.students.health.immunizations(params.id),
    },
    {
      label: t("documents"),
      href: routes.students.health.documents(params.id),
    },
  ];
  return (
    <div className="mb-2 flex flex-col">
      <ul className="flex flex-row items-center justify-start gap-4 px-2">
        {healthLinks.map((menu, index) => {
          const isActive = pathname === menu.href;
          return (
            <li key={index} className="py-2">
              <Link
                className={cn(
                  "flex items-center py-2 text-sm",
                  isActive
                    ? "border-b-primary border-b"
                    : "text-muted-foreground",
                )}
                href={menu.href + "?" + createQueryString({})}
              >
                {menu.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Separator className="-my-2" />
    </div>
  );
}
