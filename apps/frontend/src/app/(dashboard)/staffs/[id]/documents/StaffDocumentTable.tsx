"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { DownloadCloud, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
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
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function StaffDocumentTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: documents } = useSuspenseQuery(
    trpc.staff.documents.queryOptions(params.id),
  );

  const t = useTranslations();
  const locale = useLocale();

  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const handleDeleteAttachments = async (documentId: string) => {
    const response = await fetch("/api/upload/documents", {
      method: "DELETE",
      body: JSON.stringify({
        documentId: documentId,
      }),
    });
    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };

  const deleteDocumentMutation = useMutation(
    trpc.document.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.documents.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("created_by")}</TableHead>
              <TableHead>{t("files")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyComponent title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
            {documents.map((document) => {
              return (
                <TableRow key={document.id}>
                  <TableCell>
                    {document.createdAt.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>{document.description}</TableCell>
                  <TableCell>{document.createdBy.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {document.attachments.map((attachment, index) => {
                        return (
                          <Link
                            href={`/api/download/documents/${attachment}`}
                            className="flex items-center gap-1 text-blue-600 underline"
                            target="_blank"
                            key={attachment}
                          >
                            File {index + 1}
                            <DownloadCloud className="size-4" />
                          </Link>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={async () => {
                            const isConfirm = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirm) {
                              toast.loading(t("deleting"), { id: 0 });
                              await handleDeleteAttachments(document.id);
                              deleteDocumentMutation.mutate(document.id);
                            }
                          }}
                        >
                          <Trash2 />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
