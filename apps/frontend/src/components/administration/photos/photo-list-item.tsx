"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

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
    <div className="min-w-[273px] rounded-lg border border-muted p-5 shadow-sm hover:shadow-lg">
      <div className="flex items-start justify-between">
        <Link
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100"
          href={href ?? "#"}
        >
          <FolderIcon className="h-7 w-7" />
        </Link>
        <div className="flex">
          <Favorite />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <PiDotsThreeOutlineVerticalFill className="h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm">
                  <Pencil className="mr-2 h-5 w-5" /> {t("edit")}
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="mr-2 h-5 w-5" />
                  {t("delete")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Link href={href ?? "#"}>
        <h4 className="mb-1 truncate text-sm font-medium text-gray-800">
          {title}
        </h4>
        <ul className="flex list-inside list-disc gap-3.5">
          <li className="list-none text-sm text-gray-500">{size}</li>
          <li className="text-sm text-gray-500">
            {totalFiles} {t("files")}
          </li>
        </ul>
      </Link>
    </div>
  );
}
