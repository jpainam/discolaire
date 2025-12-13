"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

import FolderIcon from "~/components/icons/folder-solid";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { breadcrumbAtom } from "~/lib/atoms";

export function PhotosList() {
  const t = useTranslations();
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
    <div className="grid gap-4 lg:grid-cols-3">
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
  const t = useTranslations();
  return (
    <Link href={href}>
      <Card className="gap-2 p-2">
        <CardHeader className="p-2">
          <CardTitle>
            <FolderIcon className="h-7 w-7" />
          </CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        {/* <CardContent></CardContent> */}
        <CardFooter className="px-2">
          <ul className="flex list-inside list-disc gap-3.5">
            <li className="list-none text-sm">{size}</li>
            <li className="text-sm">
              {totalFiles} {t("files")}
            </li>
          </ul>
        </CardFooter>
      </Card>
    </Link>
  );
}
