"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ContactStudentOverview({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const { data: overview } = useSuspenseQuery(
    trpc.contact.studentOverview.queryOptions(contactId),
  );
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elèves</CardTitle>
        <CardDescription>Liste des élèves liées au contact</CardDescription>
        <CardAction>
          <Button
            onClick={() => {
              router.push(`/contacts/${contactId}/students`);
            }}
            variant={"link"}
            size={"xs"}
          >
            Voir plus
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("balance")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overview.map((std) => {
              const student = std.student;
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Link
                      className="text-muted-foreground hover:underline"
                      href={`/students/${student.id}`}
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
                  <TableCell>
                    <Badge
                      appearance={"light"}
                      size={"xs"}
                      variant={std.balance < 0 ? "destructive" : "success"}
                    >
                      {std.balance.toLocaleString(locale, {
                        style: "currency",
                        currency: CURRENCY,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
