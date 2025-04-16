"use client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import FolderIcon from "~/components/icons/folder-solid";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";

export function PhotosList() {
  const { t } = useLocale();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    setBreadcrumbs([
      {
        name: t("Administration"),
        url: "/administration",
      },
      {
        name: t("Photos"),
        url: "/administration/photos",
      },
    ]);
  }, [setBreadcrumbs, t]);
  return (
    <div className="grid grid-flow-col gap-4">
      <PhotoListItem
        href={`/administration/photos/students`}
        title={t("Student photos")}
        size={"2.4 GB"}
        totalFiles={135}
      />

      <PhotoListItem
        title={t("Staff photos")}
        size={"1.8 GB"}
        totalFiles={15}
        href={`/administration/photos/staffs`}
      />

      <PhotoListItem
        title={t("Parent photos")}
        href={`/administration/photos/contacts`}
        size={"528 MB"}
        totalFiles={800}
      />
    </div>
  );
}

function PhotoListItem({
  title,
  href,
  size,
  totalFiles,
}: {
  title: string;
  size: string;
  totalFiles: number;
  href: string;
}) {
  const { t } = useLocale();
  return (
    <Link href={href}>
      <Card>
        <CardHeader>
          <CardTitle>
            <FolderIcon className="h-7 w-7" />
          </CardTitle>
          <CardDescription>{title}</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        {/* <CardContent></CardContent> */}
        <CardFooter>
          <ul className="flex list-inside list-disc gap-3.5">
            <li className="list-none text-sm ">{size}</li>
            <li className="text-sm ">
              {totalFiles} {t("files")}
            </li>
          </ul>
        </CardFooter>
      </Card>
    </Link>
  );
}
