"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/components/pagination";

import { useTRPC } from "~/trpc/react";

type Student = RouterOutputs["student"]["all"][number];

export function StudentFooter() {
  const locale = useLocale();
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: student } = useSuspenseQuery(
    trpc.student.get.queryOptions(params.id),
  );

  const [prevStudent, _setPrevStudent] = useState<Student | null>(null);
  const [nextStudent, _setNextStudent] = useState<Student | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    // if (studentsQuery.data && studentQuery.data) {
    //   const currentIndex = studentsQuery.data?.findIndex(
    //     (s) => s.id === studentQuery.data?.id
    //   );
    //   // setPrevStudent(studentsQuery.data[currentIndex - 1] || null);
    //   // setNextStudent(
    //   //   studentsQuery.data ? studentsQuery.data[currentIndex + 1] : null
    //   // );
    // }
  }, [student]);

  const dateFormatter = Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="text-muted-foreground text-xs">
        {t("lastUpdatedAt")}{" "}
        {
          <time dateTime={new Date(student.updatedAt).toISOString()}>
            {dateFormatter.format(new Date(student.updatedAt))}
          </time>
        }
      </div>
      <Pagination className="mr-0 ml-auto w-auto">
        <PaginationContent className="gap-4">
          <PaginationItem>
            <Button
              disabled={!prevStudent}
              size="icon"
              onClick={() => {
                if (!prevStudent) return;
                router.push(pathname.replace(params.id, prevStudent.id));
              }}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t("previousStudent")}</span>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              disabled={!nextStudent}
              onClick={() => {
                if (!nextStudent) return;
                router.push(pathname.replace(params.id, nextStudent.id));
              }}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{t("nextStudent")}</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
