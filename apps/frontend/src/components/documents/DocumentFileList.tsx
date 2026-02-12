import { DownloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { getDocumentFileCategory } from "@repo/utils";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";
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
import { useModal } from "~/hooks/use-modal";
import { DeleteIcon, IDCardIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { EmptyComponent } from "../EmptyComponent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  getColor,
  getDocumentDisplayType,
  iconMap,
} from "./documentTypeStyles";

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
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const deleteFile = async (docId: string) => {
    try {
      toast.loading(t("deleting"), { id: 0 });
      const response = await fetch("/api/upload/documents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
        }),
      });
      if (!response.ok) {
        const { error } = (await response.json()) as {
          error?: string;
        };
        toast.error(error ?? response.statusText, {
          id: 0,
        });
        return;
      }
      await queryClient.invalidateQueries(trpc.document.pathFilter());
      toast.success(t("deleted_successfully"), {
        id: 0,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete document",
        { id: 0 },
      );
    }
  };
  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
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
                    {Array.from({ length: 6 }).map((_, tt) => (
                      <TableCell key={tt}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : docs?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyComponent
                    title="Aucun document"
                    description="Commencer par télécharger quelques documents"
                  />
                </TableCell>
              </TableRow>
            ) : (
              docs?.map((doc) => {
                const category = getDocumentFileCategory(
                  doc.mime ?? null,
                  doc.url,
                );
                const displayType = getDocumentDisplayType(category);
                const iconColor = getColor(displayType);
                const Icon = iconMap[displayType];

                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <span
                        className="flex size-8 items-center justify-center rounded-md"
                        style={{ backgroundColor: `${iconColor}15` }}
                      >
                        <Icon className="size-4" style={{ color: iconColor }} />
                      </span>
                    </TableCell>
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
                      <div className="flex items-center justify-center gap-2">
                        {doc.createdAt.toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <Badge variant={"secondary"}>
                          {doc.createdBy.username}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              const url = `/api/download/documents/${doc.url}`;
                              window.open(url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            <HugeiconsIcon
                              icon={DownloadIcon}
                              strokeWidth={2}
                              className="size-4"
                            />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              openModal({
                                title: "Rename document",
                                description: doc.title,
                                view: (
                                  <CreateEditDocument
                                    documentId={doc.id}
                                    title={doc.title ?? ""}
                                    entityId={entityId}
                                    entityType={entityType}
                                  />
                                ),
                              });
                            }}
                          >
                            <IDCardIcon />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={async () => {
                              await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),

                                onConfirm: async () => {
                                  await deleteFile(doc.id);
                                },
                              });
                            }}
                          >
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
