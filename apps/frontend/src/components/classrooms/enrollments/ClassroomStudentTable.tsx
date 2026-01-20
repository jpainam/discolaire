"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { StudentContactListSheet } from "~/components/students/contacts/StudentContactListSheet";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { ContactIcon, DeleteIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ClassroomStudentTable({
  classroomId,
}: {
  classroomId: string;
}) {
  const trpc = useTRPC();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const router = useRouter();
  const canDeleteEnrollment = useCheckPermission("enrollment.delete");
  const queryClient = useQueryClient();

  const unenrollStudentsMutation = useMutation(
    trpc.enrollment.deleteByStudentIdClassroomId.mutationOptions({
      onSuccess: async () => {
        toast.success(t("success"), { id: 0 });
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openSheet } = useSheet();

  const confirm = useConfirm();
  const { schoolYear } = useSchool();
  const filtered = useMemo(() => {
    return students.filter((stud) =>
      getFullName(stud).toLowerCase().includes(query),
    );
  }, [query, students]);
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="grid flex-row items-center gap-4 md:flex">
        <InputGroup className="w-96">
          <InputGroupInput
            placeholder={t("search")}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="ml-auto">
          {selectedIds.length > 0 && canDeleteEnrollment && (
            <Button
              variant="destructive"
              disabled={!schoolYear.isActive}
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: t("unenroll"),
                  description: t("delete_confirmation"),
                  alertDialogTitle: {
                    className: "flex items-center gap-2",
                  },
                });
                if (isConfirmed) {
                  toast.loading(t("Processing"), { id: 0 });
                  unenrollStudentsMutation.mutate({
                    studentId: selectedIds,
                    classroomId,
                  });
                }
              }}
            >
              <DeleteIcon />
              {t("unenroll")}
              <span>({selectedIds.length})</span>
            </Button>
          )}
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[20px]">
                <Checkbox
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    if (isChecked) {
                      setSelectedIds(students.map((std) => std.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
              <TableHead>{t("placeOfBirth")}</TableHead>
              <TableHead>{t("dateOfBirth")}</TableHead>
              <TableHead>{t("isRepeating")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((stud, index) => {
              return (
                <TableRow
                  key={index}
                  data-state={selectedIds.includes(stud.id) && "selected"}
                >
                  <TableCell className="w-[20px]">
                    <Checkbox
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setSelectedIds((prev) =>
                          isChecked
                            ? [...prev, stud.id]
                            : prev.filter((p) => p !== stud.id),
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <UserLink
                      id={stud.id}
                      name={getFullName(stud)}
                      avatar={stud.avatar}
                      profile="student"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.registrationNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.placeOfBirth}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stud.dateOfBirth?.toLocaleDateString(locale, {
                      timeZone: "UTC",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {stud.isRepeating ? (
                      <Badge variant={"outline"} className="text-destructive">
                        {t("yes")}
                      </Badge>
                    ) : (
                      <Badge variant={"outline"}>{t("no")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Badge
                      appearance={"outline"}
                      variant={stud.gender == "male" ? "info" : "destructive"}
                    >
                      {t(stud.gender ?? "male")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"icon-sm"} variant={"ghost"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/students/${stud.id}`);
                          }}
                        >
                          <ViewIcon /> {t("details")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            openSheet({
                              title: t("parents"),
                              view: (
                                <StudentContactListSheet studentId={stud.id} />
                              ),
                            });
                          }}
                        >
                          <ContactIcon />
                          {t("parents")}
                        </DropdownMenuItem>
                        {canDeleteEnrollment && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={!schoolYear.isActive}
                              variant="destructive"
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("unenroll") + " " + stud.lastName,
                                  description: t("delete_confirmation"),
                                });
                                if (isConfirmed) {
                                  toast.loading(t("Processing"), { id: 0 });
                                  unenrollStudentsMutation.mutate({
                                    classroomId: classroomId,
                                    studentId: stud.id,
                                  });
                                }
                              }}
                            >
                              <DeleteIcon /> {t("unenroll")}
                            </DropdownMenuItem>
                          </>
                        )}
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
