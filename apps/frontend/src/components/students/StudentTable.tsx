"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { ViewIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { getAge, getFullName } from "~/utils";
import { EmptyComponent } from "../EmptyComponent";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { SimpleTooltip } from "../simple-tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export function StudentTable() {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(
    trpc.enrollment.all.queryOptions(),
  );
  const [query, setQuery] = useState("");

  const t = useTranslations();
  const locale = useLocale();

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStudents = useMemo(() => {
    if (!normalizedQuery) {
      return students;
    }

    return students.filter((student) => {
      const searchableValues = [
        decode(student.lastName ?? ""),
        decode(student.firstName ?? ""),
        getFullName(student),
        student.classroom?.name ?? "",
        student.residence ?? "",
        student.gender ? t(student.gender) : "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableValues.includes(normalizedQuery);
    });
  }, [normalizedQuery, students, t]);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <InputGroup className="lg:w-1/3">
          <InputGroupInput
            value={query}
            placeholder={t("search")}
            onChange={(event) => setQuery(event.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[45px]"></TableHead>
              <TableHead>{t("lastName")}</TableHead>
              <TableHead>{t("firstName")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead className="text-center">{t("isRepeating")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("age")}</TableHead>
              <TableHead>{t("residence")}</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground h-24">
                  <EmptyComponent
                    title="Aucun élève"
                    description="Cet utilisateur n'a aucun élève"
                  />
                </TableCell>
              </TableRow>
            )}
            {filteredStudents.map((student) => {
              const dateOfBirth = student.dateOfBirth?.toLocaleDateString(
                locale,
                {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );
              const age = getAge(student.dateOfBirth);

              return (
                <TableRow key={student.id}>
                  <TableCell className="w-[45px]">
                    <AvatarState
                      avatar={student.avatar}
                      pos={getFullName(student).length}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      className="line-clamp-1 capitalize hover:text-blue-600 hover:underline"
                      href={routes.students.details(student.id)}
                    >
                      {decode(student.lastName ?? "")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-muted-foreground line-clamp-1 hover:text-blue-600 hover:underline"
                      href={routes.students.details(student.id)}
                    >
                      <span className="capitalize">
                        {decode(student.firstName ?? "")}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {student.gender ? t(student.gender) : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {student.isRepeating ? (
                      <Badge variant="destructive">{t("yes")}</Badge>
                    ) : (
                      <Badge variant="outline">{t("no")}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.classroom ? (
                      <Link
                        className="text-muted-foreground truncate hover:text-blue-600 hover:underline"
                        href={routes.classrooms.details(student.classroom.id)}
                      >
                        {student.classroom.name}
                      </Link>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <SimpleTooltip
                      content={dateOfBirth ?? ""}
                      className="text-muted-foreground"
                    >
                      <span>{age} ans</span>
                    </SimpleTooltip>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.residence}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size={"icon"}>
                          <DotsHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(routes.students.details(student.id));
                          }}
                        >
                          <ViewIcon /> {t("details")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownInvitation
                          entityId={student.id}
                          entityType="student"
                          email={student.user?.email}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
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
