"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search, UserCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Badge } from "../base-badge";
import { EmptyComponent } from "../EmptyComponent";
import { UserLink } from "../UserLink";

export function QuickStudentList() {
  const t = useTranslations();
  const locale = useLocale();
  const [queryText, setQueryText] = useState<string>("");
  const debounced = useDebouncedCallback((value: string) => {
    void setQueryText(value);
  }, 1000);

  const trpc = useTRPC();
  const { data: students, isPending } = useQuery(
    trpc.student.all.queryOptions({ query: queryText, limit: 10 }),
  );

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border flex flex-col items-stretch gap-3 border-b p-4 sm:flex-row sm:items-center sm:gap-4">
        <InputGroup className="w-96">
          <InputGroupInput
            onChange={(e) => debounced(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {students?.length} results
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("dateOfBirth")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`row-${index}`}>
                  {Array.from({ length: 4 }).map((_, ind) => (
                    <TableCell key={`cell-${index}-${ind}`}>
                      <Skeleton className="h-8" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
            {students?.map((st) => {
              return (
                <TableRow key={st.id}>
                  <TableCell>
                    <UserLink
                      name={getFullName(st)}
                      id={st.id}
                      avatar={st.user?.avatar}
                      profile="student"
                    />
                  </TableCell>
                  <TableCell>
                    {st.dateOfBirth?.toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="hover:underline"
                      href={`/classrooms/${st.classroom?.id}`}
                    >
                      {st.classroom?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={st.gender == "male" ? "info" : "destructive"}
                      appearance={"outline"}
                    >
                      {t(st.gender ?? "male")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon-sm"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}

            {students?.length == 0 && !isPending && (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyComponent icon={<UserCircle />} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
