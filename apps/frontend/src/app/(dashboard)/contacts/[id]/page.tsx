import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { getFullName } from "~/utils";
import { StatCards } from "./StatCards";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const contactId = params.id;

  batchPrefetch([
    trpc.contact.get.queryOptions(contactId),
    trpc.contact.students.queryOptions(contactId),
  ]);
  const t = await getTranslations();
  //const locale = await getLocale();
  const queryClient = getQueryClient();
  const studentContacts = await queryClient.fetchQuery(
    trpc.contact.students.queryOptions(contactId),
  );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 p-4 xl:grid-cols-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          }
        >
          <StatCards />
        </Suspense>
      </ErrorBoundary>
      <div className="grid gap-4 px-4 xl:grid-cols-3">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Card>
            <CardHeader>
              <CardTitle>Elèves</CardTitle>
              <CardDescription>
                Liste des élèves liées au contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("fullName")}</TableHead>
                    <TableHead>{t("classroom")}</TableHead>
                    {/* <TableHead>{t("dateOfBirth")}</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentContacts.map((std) => {
                    const student = std.student;
                    return (
                      <TableRow key={std.studentId}>
                        <TableCell>
                          <Link
                            className="text-muted-foreground hover:underline"
                            href={`/students/${std.studentId}`}
                          >
                            {getFullName(student)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            className="hover:underline"
                            href={`/classrooms/${student.classroom?.id}`}
                          >
                            {student.classroom?.reportName}
                          </Link>
                        </TableCell>
                        {/* <TableCell>
                          {student.dateOfBirth?.toLocaleDateString(locale, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
