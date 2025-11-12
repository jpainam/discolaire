"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, PanelLeftOpen, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useSheet } from "~/hooks/use-sheet";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { ClassroomFund } from "./ClassroomFund";

export function FundTable({ journalId }: { journalId: string }) {
  const trpc = useTRPC();
  const quotaQuery = useQuery(
    trpc.transaction.quotas.queryOptions({ journalId }),
  );
  const locale = useLocale();
  const t = useTranslations();
  const quotas = quotaQuery.data ?? [];
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="ml-auto flex items-center gap-2">
          <Button variant={"secondary"} size={"sm"}>
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            <XMLIcon />
            {t("xml_export")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("effectif")}</TableHead>
              <TableHead>{t("expected_amount")}</TableHead>
              <TableHead>{t("received_amount")}</TableHead>
              <TableHead>{t("difference")}</TableHead>
              <TableHead className="w-[75px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotaQuery.isPending && <FunTableSkeleton />}
            {quotas.map((q, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      href={`/classrooms/${q.classroomId}`}
                      className="hover:underline"
                    >
                      {q.classroom}
                    </Link>
                  </TableCell>
                  <TableCell>{q.effectif}</TableCell>
                  <TableCell>
                    {q.revenue.toLocaleString(locale, {
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                      currency: CURRENCY,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      {q.paid.toLocaleString(locale, {
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                        currency: CURRENCY,
                      })}
                      <Badge
                        variant={
                          q.remaining == 0
                            ? "success"
                            : q.paid < q.remaining
                              ? "destructive"
                              : "warning"
                        }
                        appearance={"light"}
                      >
                        {q.revenue == 0
                          ? 0
                          : ((100 * q.paid) / q.revenue).toFixed(2)}
                        %
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      {q.remaining.toLocaleString(locale, {
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                        currency: CURRENCY,
                      })}
                      <Badge
                        variant={
                          q.remaining == 0
                            ? "success"
                            : q.paid < q.remaining
                              ? "destructive"
                              : "warning"
                        }
                        appearance={"light"}
                      >
                        {q.revenue == 0
                          ? 0
                          : ((100 * q.remaining) / q.revenue).toFixed(2)}
                        %
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        openSheet({
                          title: `Compte Caisse - ${new Date().toLocaleDateString(locale, { month: "short", day: "2-digit", year: "numeric" })}`,
                          description: q.classroom,
                          view: (
                            <ClassroomFund
                              classroomId={q.classroomId}
                              journalId={journalId}
                            />
                          ),
                        });
                      }}
                      variant={"secondary"}
                      size={"sm"}
                    >
                      {t("details")}
                      <PanelLeftOpen />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FunTableSkeleton() {
  return (
    <>
      {Array.from({ length: 16 }).map((_, index) => {
        return (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
