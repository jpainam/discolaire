"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

import FolderIcon from "~/components/icons/folder-solid";
import Favorite from "~/components/shared/favorite";

interface PhotoCardProps {
  title: string;
  size: string;
  totalFiles: number;
  href?: string;
}

export function PhotoListItem({
  title,
  href,
  size,
  totalFiles,
}: PhotoCardProps) {
  const { t } = useLocale();
  return (
    <div className=" rounded-lg border border-muted p-5 shadow-sm hover:shadow-lg">
      <div className="flex items-start justify-between">
        <Link
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          href={href ?? "#"}
        >
          <FolderIcon className="h-7 w-7" />
        </Link>
        <div className="flex gap-0 items-center">
          <Favorite />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </div>
      </div>
      <Link href={href ?? "#"}>
        <h4 className="mb-1 truncate text-sm font-medium ">{title}</h4>
        <ul className="flex list-inside list-disc gap-3.5">
          <li className="list-none text-sm ">{size}</li>
          <li className="text-sm ">
            {totalFiles} {t("files")}
          </li>
        </ul>
      </Link>
    </div>
  );
}
