"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { Loader2Icon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { DatePicker } from "~/components/DatePicker";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function ExclusionTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const exclusionQuery = useQuery(trpc.exclusion.all.queryOptions());
  const exclusion = exclusionQuery.data ?? [];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("all_exclusions")}</CardTitle>
        <CardDescription>Toutes les exclusion de la journée</CardDescription>
        <CardAction>
          <DatePicker />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("reason")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exclusionQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              exclusion.slice(0, 5).map((exclusion, index) => (
                <TableRow key={`${exclusion.id}-${index}`}>
                  <TableCell className="py-0">
                    <Link
                      className="hover:underline"
                      href={`/students/${exclusion.student.id}`}
                    >
                      {exclusion.student.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="py-0">{exclusion.reason}</TableCell>
                  <TableCell className="py-0">
                    {exclusion.startDate.toLocaleDateString(i18next.language, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.warning("Not implemented yet");
                          }}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.warning("Not implemented yet");
                          }}
                          variant="destructive"
                        >
                          <Trash2 />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
