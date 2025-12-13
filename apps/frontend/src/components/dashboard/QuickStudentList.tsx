"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Edit,
  Eye,
  GraduationCap,
  HeartPlus,
  MoreHorizontal,
  Search,
  Trash2,
  UserCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Badge as BaseBadge } from "../base-badge";
import { EmptyComponent } from "../EmptyComponent";
import { UserLink } from "../UserLink";

export function QuickStudentList() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedSchoolYear, setSchoolYear] = useState<string>();

  const [queryText, setQueryText] = useState<string>("");
  const debounced = useDebouncedCallback((value: string) => {
    void setQueryText(value);
  }, 300);

  const trpc = useTRPC();
  const { data: schoolYears } = useQuery(trpc.schoolYear.all.queryOptions());
  const { data: students, isPending } = useQuery(
    trpc.student.all.queryOptions({
      query: queryText,
      limit: 10,
      schoolYearId: selectedSchoolYear,
    }),
  );

  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const canDeleteStudent = useCheckPermission(
    "student",
    PermissionAction.DELETE,
  );

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const router = useRouter();

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border flex flex-col items-stretch gap-3 border-b p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <InputGroup className="h-8">
            <InputGroupInput
              className="w-full pl-8"
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
        <div>
          <Select onValueChange={(val) => setSchoolYear(val)}>
            <SelectTrigger size="sm" className="w-[180px]">
              <SelectValue placeholder={t("schoolYear")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("schoolYear")}</SelectLabel>
                {schoolYears?.map((s, index) => (
                  <SelectItem key={index} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
              <TableHead>{t("dateOfBirth")}</TableHead>
              <TableHead>{t("placeOfBirth")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`row-${index}`}>
                  {Array.from({ length: 7 }).map((_, ind) => (
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
              const enrollments = st.enrollments;
              const lastEnrollment = enrollments
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.schoolYear.startDate).getTime() -
                    new Date(a.schoolYear.startDate).getTime(),
                )[0];
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
                    <div className="flex flex-row items-center gap-1.5">
                      {st.registrationNumber && (
                        <Badge
                          variant="secondary"
                          className="border-border border"
                        >
                          {st.registrationNumber}
                        </Badge>
                      )}
                      {st.status == "ACTIVE" ? (
                        <Badge variant="outline" className="gap-1.5">
                          <span
                            className="size-1.5 rounded-full bg-emerald-500"
                            aria-hidden="true"
                          ></span>
                          {t(`${st.status.toLowerCase()}`)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1.5">
                          <span
                            className="size-1.5 rounded-full bg-red-500"
                            aria-hidden="true"
                          ></span>
                          {t(`${st.status.toLowerCase()}`)}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {st.dateOfBirth?.toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {st.placeOfBirth}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        className="text-muted-foreground hover:underline"
                        href={
                          st.classroom
                            ? `/classrooms/${st.classroom.id}`
                            : lastEnrollment
                              ? `/classrooms/${lastEnrollment.id}`
                              : "#"
                        }
                      >
                        {st.classroom
                          ? st.classroom.name
                          : lastEnrollment
                            ? lastEnrollment.classroom.name
                            : "N/A"}
                      </Link>
                      <span className="border-border bg-muted text-foreground rounded-md border px-2 py-0.5 text-xs">
                        {st.classroom
                          ? st.classroom.schoolYear.name
                          : lastEnrollment
                            ? lastEnrollment.schoolYear.name
                            : "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <BaseBadge
                      variant={st.gender == "male" ? "info" : "destructive"}
                      appearance={"outline"}
                    >
                      {t(st.gender ?? "male")}
                    </BaseBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.warning(
                              "This feature is not implemented yet.",
                            );
                            //router.push(`/students/${student.id}/favorite`);
                          }}
                        >
                          <HeartPlus className="h-4 w-4" />
                          {t("Favorite")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/students/${st.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          {t("View Profile")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/students/${st.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/students/${st.id}/attendances`);
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                          {t("View Attendance")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/students/${st.id}/grades`);
                          }}
                        >
                          <GraduationCap className="h-4 w-4" />
                          {t("View Grades")}
                        </DropdownMenuItem>
                        {canDeleteStudent && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("delete"),
                                  description: t("delete_confirmation", {
                                    name: getFullName(st),
                                  }),
                                });
                                if (isConfirmed) {
                                  toast.loading(t("deleting"), { id: 0 });
                                  deleteStudentMutation.mutate(st.id);
                                }
                              }}
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </>
                        )}
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
