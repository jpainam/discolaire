"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { getFileBasename, isRichText } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function SubjectJournalList() {
  const { t, i18n } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string; subjectId: string }>();
  const { data: subject } = useSuspenseQuery(
    trpc.subject.get.queryOptions(Number(params.subjectId)),
  );
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const confirm = useConfirm();

  const deleteSubjectJournal = useMutation(
    trpc.teachingSession.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.teachingSession.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const pageIndex = searchParams.get("pageIndex")
    ? Number(searchParams.get("pageIndex"))
    : 0;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;

  const { data: journals } = useSuspenseQuery(
    trpc.teachingSession.bySubject.queryOptions({
      subjectId: Number(params.subjectId),
      pageIndex,
      pageSize,
    }),
  );
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
          size={"sm"}
          onClick={() => {
            paginate(pageIndex - 1);
          }}
          disabled={pageIndex === 1}
          variant="outline"
        >
          <ChevronLeftIcon className="h-4 w-4" />
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
