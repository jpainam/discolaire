"use client";

import { MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { sidebarIcons } from "../sidebar-icons";

export function SubjectDetailsHeader() {
  const Icon = sidebarIcons.programs;
  const params = useParams<{ id: string; subjectId: string }>();
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
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

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
