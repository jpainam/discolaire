"use client";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import i18next from "i18next";
import {
  DownloadCloud,
  FileTextIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
export function StudentDocumentTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: documents } = useSuspenseQuery(
    trpc.student.documents.queryOptions(params.id)
  );
  const { t } = useLocale();

  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const deleteDocumentMutation = useMutation(
    trpc.document.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.document.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        //await deleteFileFromAws(url);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  return (
    <div className="mx-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("created_at")}</TableHead>
            <TableHead>{t("created_by")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState title={t("no_data")} className="my-8" />
              </TableCell>
            </TableRow>
          )}
          {documents.map((document) => {
            return (
              <TableRow key={document.id}>
                <TableCell className="w-10 py-0">
                  <FileTextIcon className="h-4 w-4" />
                </TableCell>
                <TableCell className="py-0">{document.title}</TableCell>
                <TableCell className="py-0">{document.description}</TableCell>
                <TableCell className="py-0">
                  {document.createdAt.toLocaleDateString(i18next.language, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-0">
                  {document.createdBy.name ?? t("unknown")}
                </TableCell>
                <TableCell className="py-0 text-right">
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
                      <DropdownMenuItem
                      // onSelect={() => {
                      //   toast.promise(downloadFileFromAws(url), {
                      //     success: (signedUrl) => {
                      //       window.open(signedUrl, "_blank");
                      //       return t("downloaded");
                      //     },
                      //     loading: t("downloading"),
                      //     error: (error) => {
                      //       return getErrorMessage(error);
                      //     },
                      //   });
                      // }}
                      >
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        {t("download")}
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
  );
}
