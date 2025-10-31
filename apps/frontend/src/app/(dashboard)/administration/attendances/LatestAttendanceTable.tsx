"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";



import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";



import { useTRPC } from "~/trpc/react";
import { getNameParts } from "~/utils";


export function LatestAttendanceTable({ className }: { className: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const locale = useLocale();
  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.all.queryOptions({ limit: 7 }),
  );
  return (
    <div className={cn(className)}>
      <div className="bg-background overflow-hidden rounded-md border text-xs">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>Absence</TableHead>
              <TableHead>Retard</TableHead>
              <TableHead>Consigne</TableHead>
              <TableHead>Exclusion</TableHead>
              <TableHead>Bavardage</TableHead>
              <TableHead>{t("term")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.map((att, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    {att.createdAt.toLocaleDateString(locale, {
                      year: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="hover:underline"
                      href={`/students/${att.studentId}/attendances`}
                    >
                      {getNameParts(att.student, 1)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{att.absence}</TableCell>
                  <TableCell className="text-center">{att.late}</TableCell>
                  <TableCell className="text-center">{att.consigne}</TableCell>
                  <TableCell className="text-center">{att.exclusion}</TableCell>
                  <TableCell className="text-center">{att.chatter}</TableCell>
                  <TableCell>{att.term.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}