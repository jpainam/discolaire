"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { getFileBasename, isRichText } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { api } from "~/trpc/react";

export function SubjectJournalList({
  subject,
  journals,
}: {
  subject: RouterOutputs["subject"]["get"];
  journals: RouterOutputs["subjectJournal"]["bySubject"];
}) {
  const { t, i18n } = useLocale();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const deleteSubjectJournal = api.subjectJournal.delete.useMutation({
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.push(
        `/classrooms/${params.id}/subject_journal/${subject.id}?${createQueryString({ pageIndex: 1, pageSize: 10 })}`,
      );
    },
    onSettled: async () => {
      await utils.subjectJournal.invalidate();
    },
  });
  const pageIndex = searchParams.get("pageIndex")
    ? Number(searchParams.get("pageIndex"))
    : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const paginate = (page: number) => {
    router.push(
      `/classrooms/${params.id}/subject_journal/${subject.id}?${createQueryString({ pageIndex: page, pageSize })}`,
    );
  };

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

  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      {journals.map((journal) => (
        <div key={journal.id} className="rounded-md border p-2 bg-muted/50">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-sm">{journal.title}</span>
            <p className="text-xs text-muted-foreground">
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
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteSubjectJournal.mutate(journal.id);
                    }
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
              <span className="truncate max-w-[80%]">
                {getFileBasename(journal.attachment)}
              </span>
              <DownloadIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between pb-4">
        <Button
          size={"sm"}
          onClick={() => {
            paginate(pageIndex - 1);
          }}
          disabled={pageIndex === 1}
          variant="outline"
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          {t("previous")}
        </Button>
        <span className="text-xs">
          {t("page")} {pageIndex} of {Math.ceil(journals.length / pageSize)}
        </span>
        <Button
          size={"sm"}
          onClick={() => paginate(pageIndex + 1)}
          disabled={pageIndex === Math.ceil(journals.length / pageSize)}
          variant="outline"
        >
          {t("next")}
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
