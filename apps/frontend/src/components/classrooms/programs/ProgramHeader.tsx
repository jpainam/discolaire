"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { MoreVertical, Pencil } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useRouter } from "@repo/lib/hooks/use-router";
import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@repo/ui/BreadCrumb";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { routes } from "~/configs/routes";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function ProgramHeader() {
  const { t } = useLocale();
  const params = useParams() as { id: string; subjectId: string };
  const subjectQuery = api.subject.get.useQuery({
    id: Number(params.subjectId),
  });
  const subject = subjectQuery.data;
  const pathname = usePathname();

  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([{ label: t("programs"), href: routes.classrooms.programs(params.id) }]);
  useEffect(() => {
    if (subject) {
      const breads = [
        { label: t("programs"), href: routes.classrooms.programs(params.id) },
        {
          label: subject.course?.name || "",
          href: routes.classrooms.programs(params.id) + `/${subject.id}`,
        },
      ];
      if (pathname.includes("create-or-edit")) {
        breads.push({
          label: `${t("create")}/${t("edit")}`,
          href:
            routes.classrooms.programs(params.id) +
            `/${subject?.id}/create-or-edit`,
        });
      }
      setBreadcrumbs(breads);
    }
  }, [params.id, pathname, subject, t]);

  const router = useRouter();

  if (subjectQuery.isError) {
    showErrorToast(subjectQuery.error);
    throw subjectQuery.error;
  }

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      <BreadCrumb
        orientation="horizontal"
        variant={"ghost"}
        className="gap-1 rounded-lg bg-background px-2"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <Fragment key={index}>
              <BreadCrumbItem className="h-7 px-2" index={index}>
                <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              </BreadCrumbItem>
              {index != breadcrumbs.length - 1 && <BreadCrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadCrumb>

      <div className="ml-auto flex flex-row gap-1">
        <Button
          onClick={() => {
            router.push(
              routes.classrooms.programs(params.id) +
                `/${subject?.id}` +
                "/create-or-edit",
            );
          }}
          size={"icon"}
          variant={"outline"}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
