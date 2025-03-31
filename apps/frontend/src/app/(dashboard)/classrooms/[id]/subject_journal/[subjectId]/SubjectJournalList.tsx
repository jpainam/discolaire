"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { useParams, useSearchParams } from "next/navigation";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

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
      `/classrooms/${params.id}/subject_journal/${subject.id}?${createQueryString({ pageIndex: page, pageSize })}`,
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">{t("approved")}</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">{t("pending")}</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500">{t("rejected")}</Badge>;
      default:
        return null;
    }
  };
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "doc":
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="mb-4 flex flex-col gap-2 p-4">
      <h3 className="text-xl font-bold">Existing Posts</h3>

      {journals.map((journal) => (
        <div key={journal.id} className="rounded-lg bg-white p-2 shadow">
          <div className="mb-2 flex items-start justify-between">
            <h4 className="text-lg font-semibold">{journal.title}</h4>
            {getStatusBadge(journal.status)}
          </div>
          <p className="mb-2 text-sm text-gray-500">
            {t("by")} {journal.createdBy.name} on{" "}
            {dateFormat.format(journal.date)}
          </p>
          <p className="mb-2">{journal.content}</p>
          <div className="flex items-center space-x-2">
            {journal.attachments.map((attachment, index) => (
              <span
                key={`${index}-attachments`}
                title={`${attachment} attachment`}
              >
                {getAttachmentIcon(attachment)}
              </span>
            ))}
          </div>
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
