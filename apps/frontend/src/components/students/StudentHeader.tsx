"use client";

import type * as RPNInput from "react-phone-number-input";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  BellRing,
  ChevronDownIcon,
  KeyRound,
  MessageCircleMore,
  MoreVertical,
  NotebookTabs,
  Pencil,
  PencilIcon,
  Phone,
  Printer,
  ShieldBan,
  SquareEqual,
  Trash2,
  UserPlus2,
  Users,
} from "lucide-react";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import { toast } from "sonner";

import { StudentStatus } from "@repo/db";
import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";

import { SimpleTooltip } from "~/components/simple-tooltip";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "../../utils/full-name";
import { CountryComponent } from "../shared/CountryPicker";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { CreateEditUser } from "../users/CreateEditUser";
import { SquaredAvatar } from "./SquaredAvatar";
import { StudentSearch } from "./StudentSearch";

interface StudentHeaderProps {
  className?: string;
}

export function StudentHeader({ className }: StudentHeaderProps) {
  const router = useRouter();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(params.id);
  const utils = api.useUtils();

  const deleteStudentMutation = api.student.delete.useMutation({
    onSettled: async () => {
      await utils.student.invalidate();
    },
    onSuccess: () => {
      router.push(routes.students.index);
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const { openModal } = useModal();

  const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();

  const disableStudentMutation = api.student.disable.useMutation({
    onSettled: () => utils.student.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const navigateToStudent = (id: string) => {
    if (!pathname.includes(params.id)) {
      router.push(`${pathname}/${id}/?${createQueryString({})}`);
      return;
    }
    const newPath = pathname.replace(params.id, id);
    router.push(`${newPath}/?${createQueryString({})}`);
  };
  const confirm = useConfirm();

  const student = studentQuery.data;

  //const studentTags = JSON.stringify(student?.tags ?? []);

  const canDeleteStudent = useCheckPermissions(
    PermissionAction.DELETE,
    "student:profile",
    {
      id: params.id,
    },
  );
  const canEditStudent = useCheckPermissions(
    PermissionAction.UPDATE,
    "student:profile",
    {
      id: params.id,
    },
  );
  const [open, setOpen] = React.useState(false);

  return (
    <header className={cn(className)}>
      <div className="flex w-full gap-1">
        <SquaredAvatar student={student} />
        <div className="flex w-full flex-col gap-1">
          {studentQuery.isPending ? (
            <Skeleton className="w-full 2xl:w-[500px]" />
          ) : (
            <Button
              variant="outline"
              className={cn(
                "flex w-full justify-between bg-background text-sm font-semibold shadow-none 2xl:w-[500px]",
              )}
              onClick={() => setOpen(true)}
            >
              <span>{getFullName(student)}</span>
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
          <StudentSearch
            onChange={(val) => {
              navigateToStudent(val);
            }}
            open={open}
            setOpen={setOpen}
          />

          {studentQuery.isPending && (
            <>
              <Skeleton className="h-8 w-full lg:w-[25%]" />
              <Skeleton className="h-8 w-full lg:w-[35%]" />
              <Skeleton className="h-8 w-full lg:w-[45%]" />
            </>
          )}
          {!studentQuery.isPending && (
            <div className="flex flex-row items-center gap-1">
              <FlatBadge
                variant={
                  student?.status == StudentStatus.ACTIVE ? "green" : "red"
                }
              >
                {t(`${student?.status}`)}
              </FlatBadge>

              {canEditStudent && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <Button
                    disabled={!canEditStudent}
                    size={"icon"}
                    onClick={() => {
                      if (!student) return;
                      router.push(routes.students.edit(student.id));
                    }}
                    aria-label={t("edit")}
                    variant="ghost"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Separator orientation="vertical" className="h-4" />
              <SimpleTooltip content="Notification reçus">
                <Button size={"icon"} aria-label="Notification" variant="ghost">
                  <BellRing className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <Separator orientation="vertical" className="h-4" />
              <SimpleTooltip content="Dialoguer">
                <Button
                  size={"icon"}
                  aria-label="Notification"
                  variant="ghost"
                  onClick={() => {
                    router.push(`${routes.students.notifications(params.id)}`);
                  }}
                >
                  <MessageCircleMore className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <Separator orientation="vertical" className="h-4" />
              <SimpleTooltip content="Contacts et Responsables">
                <Button
                  size={"icon"}
                  aria-label="Contacts"
                  variant="ghost"
                  onClick={() => {
                    router.push(routes.students.contacts(params.id));
                  }}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <Separator orientation="vertical" className="h-4" />
              <SimpleTooltip content="Impressions">
                <Button
                  size={"icon"}
                  aria-label="print"
                  variant="ghost"
                  onClick={() => {
                    router.push(routes.students.print(params.id));
                  }}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <Separator orientation="vertical" className="h-4" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={"icon"}
                    variant="ghost"
                    onClick={() => {
                      router.push(routes.students.contacts(params.id));
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownInvitation email={student?.email} />
                  <DropdownMenuSeparator />
                  <DropdownHelp />
                  <DropdownMenuSeparator />
                  {student && !student.userId && (
                    <DropdownMenuItem
                      onSelect={() => {
                        openModal({
                          className: "w-[500px]",
                          title: t("attach_user"),
                          view: (
                            <CreateEditUser
                              entityId={params.id}
                              type="student"
                            />
                          ),
                        });
                      }}
                    >
                      <UserPlus2 className="mr-2 h-4 w-4" />
                      {t("attach_user")}
                    </DropdownMenuItem>
                  )}
                  {student?.userId && (
                    <DropdownMenuItem
                      onSelect={() => {
                        if (!student.userId) return;
                        openModal({
                          className: "w-[500px]",
                          title: t("change_password"),
                          view: (
                            <CreateEditUser
                              userId={student.userId}
                              type="student"
                              roleIds={student.user?.roles.map((r) => r.roleId)}
                              entityId={params.id}
                              username={student.user?.username}
                            />
                          ),
                        });
                      }}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      {t("change_password")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={() => {
                      if (!student) return;
                      toast.loading(t("updating"), { id: 0 });
                      disableStudentMutation.mutate({
                        id: student.id,
                        isActive: !student.isActive,
                      });
                    }}
                  >
                    <ShieldBan className="mr-2 h-4 w-4" />
                    {student?.isActive ? t("disable") : t("enable")}
                  </DropdownMenuItem>
                  {canEditStudent && student && (
                    <DropdownMenuItem
                      onSelect={() => {
                        router.push(routes.students.edit(student.id));
                      }}
                    >
                      <PencilIcon className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                  )}
                  {canDeleteStudent && student && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={async () => {
                          const isConfirm = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            ),
                            alertDialogTitle: {
                              className: "flex items-center gap-2",
                            },
                          });
                          if (isConfirm) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteStudentMutation.mutate(student.id);
                          }
                        }}
                        disabled={!canDeleteStudent}
                        className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {!studentQuery.isPending && (
            <div className="grid grid-cols-2 flex-row items-center gap-4 text-sm font-semibold md:flex">
              {student?.registrationNumber && (
                <div className="flex flex-row items-center gap-2 rounded dark:bg-secondary">
                  <NotebookTabs className="h-4 w-4 text-foreground" />
                  <span> {student.registrationNumber}</span>
                </div>
              )}
              {student?.classroom && (
                <div className="flex flex-row items-center gap-2 rounded dark:bg-secondary">
                  <SquareEqual className="h-4 w-4 text-foreground" />
                  <Link
                    href={routes.classrooms.details(student.classroom.id)}
                    className="line-clamp-1 text-blue-700 hover:underline"
                  >
                    {student.classroom.name}
                  </Link>
                </div>
              )}

              {student?.phoneNumber && (
                <div className="flex flex-row items-center gap-2 rounded dark:bg-secondary">
                  <Phone className="h-4 w-4 text-foreground" />
                  <span> {student.phoneNumber}</span>
                </div>
              )}
              {/* {student?.email && (
                  <div className="flex p-1  bg-muted/50 text-xs rounded-sm text-muted-foreground flex-row gap-2 items-center">
                    <Mail className="text-foreground h-4 w-4" />
                    <span> {student?.email}</span>
                  </div>
                )} */}

              {student && student.isRepeating && (
                <FlatBadge variant={"red"}>{t("is_repeating")}</FlatBadge>
              )}
              <FlatBadge
                variant={student?.gender == "female" ? "pink" : "blue"}
                className="flex flex-row items-center gap-1"
              >
                {student?.gender == "male" ? (
                  <PiGenderMaleThin className="h-4 w-4" />
                ) : (
                  <PiGenderFemaleThin className="h-4 w-4" />
                )}
                {t(student?.gender ?? "male")}
              </FlatBadge>

              {student?.countryId && (
                <CountryComponent
                  className="text-sm"
                  country={student.countryId as RPNInput.Country}
                />
              )}
              {/* {student?.dateOfBirth &&
                  isAnniversary(student.dateOfBirth) == false && (
                    <div className="flex items-center flex-row gap-1">
                      <Cake className="w-5 h-5" />
                      Birthday
                    </div>
                  )} */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
