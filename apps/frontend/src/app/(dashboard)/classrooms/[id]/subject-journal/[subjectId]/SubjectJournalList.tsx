"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";

export function SubjectJournalList({ subjectId }: { subjectId: number }) {
  const { t, i18n } = useLocale();
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));
  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(0)
  );
  const paginate = (pageNumber: number) => setPageIndex(pageNumber);
  const subjectJournalsQuery = api.subjectJournal.bySubject.useQuery({
    subjectId: subjectId,
    pageIndex,
    pageSize,
  });
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
  const journals = subjectJournalsQuery.data ?? [];
  return (
    <div className="mb-4 flex flex-col gap-2 px-2">
      <h3 className="text-xl font-bold">Existing Posts</h3>
      {subjectJournalsQuery.isPending && (
        <div className="grid gap-2">
          {Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      )}
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
          onClick={() => paginate(pageIndex - 1)}
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
