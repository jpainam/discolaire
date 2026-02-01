import { DownloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeleteIcon, IDCardIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { EmptyComponent } from "../EmptyComponent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const getSize = (size: number) => {
  if (size >= 1024 ** 3) {
    return `${(size / 1024 ** 3).toFixed(1)} GB`;
  }
  if (size >= 1024 ** 2) {
    return `${(size / 1024 ** 2).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(size / 1024))} KB`;
};
export function DocumentFileList({
  entityType,
  entityId,
}: {
  entityType: "staff" | "student" | "contact";
  entityId: string;
}) {
  const trpc = useTRPC();
  const { data: docs, isPending } = useQuery(
    trpc.document.all.queryOptions({
      entityId,
      entityType,
    }),
  );
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-center">{t("Size")}</TableHead>
              <TableHead className="text-center">{t("Modified")}</TableHead>
              <TableHead className="text-center">{t("created_at")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 10 }).map((_, t) => {
                return (
                  <TableRow key={t}>
                    {Array.from({ length: 5 }).map((_, tt) => (
                      <TableCell key={tt}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : docs?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyComponent
                    title="Aucun document"
                    description="Commencer par télécharger quelques documents"
                  />
                </TableCell>
              </TableRow>
            ) : (
              docs?.map((doc) => {
                return (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell className="text-center">
                      {getSize(doc.size ?? 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {doc.updatedAt.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {doc.createdAt.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <Badge variant={"secondary"}>
                        {doc.createdBy.username}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <HugeiconsIcon
                              icon={DownloadIcon}
                              strokeWidth={2}
                              className="size-4"
                            />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IDCardIcon />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <DeleteIcon />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
