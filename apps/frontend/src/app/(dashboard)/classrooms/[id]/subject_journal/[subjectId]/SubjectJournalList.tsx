"use client";

import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { useParams, useSearchParams } from "next/navigation";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { isRichText } from "~/lib/utils";

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
  const pageIndex = searchParams.get("pageIndex")
    ? Number(searchParams.get("pageIndex"))
    : 1;
  const pageSize = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 10;
  const paginate = (page: number) => {
    router.push(
      `/classrooms/${params.id}/subject_journal/${subject.id}?${createQueryString({ pageIndex: page, pageSize })}`
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
        <div key={journal.id}>
          <div className="mb-2 flex items-start justify-between">
            <span className="font-semibold text-sm">{journal.title}</span>
            <p className="text-xs text-muted-foreground">
              {journal.createdBy.name} -{" "}
              {dateFormat.format(journal.publishDate)}
            </p>
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
            <p className="text-sm text-muted-foreground">{journal.content}</p>
          )}

          {journal.attachment && (
            <Button
              variant={"link"}
              onClick={() => {
                window.open(journal.attachment ?? "#", "_blank");
              }}
            >
              <DownloadIcon className="h-4 w-4" />
              <span className="truncate max-w-[80%]">{journal.attachment}</span>
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
