"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MoreVertical } from "lucide-react";

import { useLocale } from "@repo/i18n";
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
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { routes } from "~/configs/routes";
import { sidebarIcons } from "../sidebar-icons";

export function SubjectDetailsHeader() {
  const Icon = sidebarIcons.programs;
  const params = useParams();
  const { t } = useLocale();
  const breadcrumbs = [
    { label: t("classroom"), href: routes.classrooms.details(params.id) },
    { label: t("subjects"), href: routes.classrooms.subjects(params.id) },
    { label: t("programs"), href: routes.classrooms.programs(params.id) },
    {
      label: t("ressources"),
      href: routes.classrooms.subjects(params.id) + `/${params.subjectId}`,
    },
  ];
  return (
    <div className="flex flex-row items-center bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="mr-2 h-6 w-6" />}
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
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
