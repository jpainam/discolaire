"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/pagination";
import { Skeleton } from "@repo/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLocale } from "~/hooks/use-locale";
import { api } from "~/trpc/react";
import { Student } from "~/types/student";

export function StudentFooter() {
  const { t, i18n } = useLocale();
  const params = useParams() as { id: string };
  const studentQuery = api.student.get.useQuery(params.id);
  //const studentsQuery = api.student.all.useQuery();

  const [prevStudent, setPrevStudent] = useState<Student | null>(null);
  const [nextStudent, setNextStudent] = useState<Student | null>(null);
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
  if (!params.id) return null;
  return (
    <>
      <div className="text-xs text-muted-foreground">
        {studentQuery.data?.updatedAt && t("lastUpdatedAt")}{" "}
        {studentQuery.data?.updatedAt && (
          <time dateTime={new Date(studentQuery.data?.updatedAt).toISOString()}>
            {dateFormatter.format(new Date(studentQuery.data?.updatedAt))}
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
                prevStudent &&
                  router.push(pathname.replace(params.id, prevStudent.id));
              }}
              variant="outline"
              className="h-6 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t("previousStudent")}</span>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              disabled={!nextStudent}
              onClick={() => {
                nextStudent &&
                  router.push(pathname.replace(params.id, nextStudent.id));
              }}
              size="icon"
              variant="outline"
              className="h-6 w-8"
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
