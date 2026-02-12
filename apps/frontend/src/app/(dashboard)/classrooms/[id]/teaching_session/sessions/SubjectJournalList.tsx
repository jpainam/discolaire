"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getFileBasename, isRichText } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function SubjectJournalList({
  defaultSubjectId,
}: {
  defaultSubjectId: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [subjectId] = useQueryState(
    "subjectId",
    parseAsInteger.withDefault(defaultSubjectId),
  );

  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(0),
  );
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const confirm = useConfirm();

  const deleteSubjectJournal = useMutation(
    trpc.subjectJournal.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectJournal.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const journalsQuery = useQuery(
    trpc.subjectJournal.subject.queryOptions({
      subjectId: subjectId,
      pageIndex,
      pageSize,
    }),
  );

  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "APPROVED":
  //       return <Badge className="bg-green-500">{t("approved")}</Badge>;
  //     case "PENDING":
  //       return <Badge className="bg-yellow-500">{t("pending")}</Badge>;
  //     case "REJECTED":
  //       return <Badge className="bg-red-500">{t("rejected")}</Badge>;
  //     default:
  //       return null;
  //   }
  // };

  const dateFormat = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="flex flex-col gap-2 px-4 py-2">
        {journalsQuery.data?.map((journal) => (
          <div key={journal.id} className="bg-muted/50 rounded-md border p-2">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold">{journal.title}</span>
              <p className="text-muted-foreground text-xs">
                {journal.createdBy.name} -{" "}
                {dateFormat.format(journal.publishDate)}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"} className="size-8">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={async () => {
                      await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),

                        onConfirm: async () => {
                          await deleteSubjectJournal.mutateAsync(journal.id);
                        },
                      });
                    }}
                  >
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* {getStatusBadge(journal.status)} */}
            </div>

            {isRichText(journal.content) ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: journal.content,
                }}
              ></div>
            ) : (
              <p className="text-sm">{journal.content}</p>
            )}

            {journal.attachment && (
              <Button
                variant={"link"}
                onClick={() => {
                  if (journal.attachment)
                    window.open(journal.attachment, "_blank");
                }}
              >
                <span className="max-w-[80%] truncate">
                  {getFileBasename(journal.attachment)}
                </span>
                <DownloadIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex items-center justify-between pb-4">
          <Button
            onClick={() => {
              void setPageIndex(() => pageIndex - 1);
            }}
            disabled={pageIndex === 1}
            variant="outline"
          >
            <ChevronLeftIcon />
            {t("previous")}
          </Button>
          <span className="text-xs">
            {t("page")} {pageIndex} of{" "}
            {Math.ceil((journalsQuery.data?.length ?? 0) / pageSize)}
          </span>
          <Button
            onClick={() => {
              void setPageIndex(() => pageIndex + 1);
            }}
            disabled={
              pageIndex ===
              Math.ceil((journalsQuery.data?.length ?? 0) / pageSize)
            }
            variant="outline"
          >
            {t("next")}
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
