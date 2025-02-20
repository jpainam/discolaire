"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Student } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/components/pagination";
import { Skeleton } from "@repo/ui/components/skeleton";

import { api } from "~/trpc/react";

export function StudentFooter() {
  const { t, i18n } = useLocale();
  const params = useParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(params.id);
  //const studentsQuery = api.student.all.useQuery();

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
  }, [studentQuery.data]);

  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (studentQuery.isPending) {
    return <Skeleton className="h-full w-full" />;
  }
  const student = studentQuery.data;
  return (
    <>
      <div className="text-xs text-muted-foreground">
        {student?.updatedAt && t("lastUpdatedAt")}{" "}
        {student?.updatedAt && (
          <time dateTime={new Date(student.updatedAt).toISOString()}>
            {dateFormatter.format(new Date(student.updatedAt))}
          </time>
        )}
      </div>
      <Pagination className="ml-auto mr-0 w-auto">
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
