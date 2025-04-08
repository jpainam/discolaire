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

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import FolderIcon from "~/components/icons/folder-solid";
interface PhotoCardProps {
  title: string;
  size: string;
  totalFiles: number;
  href: string;
}

export function PhotoListItem({
  title,
  href,
  size,
  totalFiles,
}: PhotoCardProps) {
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
