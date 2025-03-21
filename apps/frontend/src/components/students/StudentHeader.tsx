"use client";

import {
  BellRing,
  CheckIcon,
  KeyRound,
  MessageCircleMore,
  MoreVertical,
  NotebookTabs,
  Pencil,
  PencilIcon,
  Phone,
  PlusIcon,
  Printer,
  Shield,
  ShieldCheck,
  ShieldEllipsis,
  ShieldX,
  SquareEqual,
  Trash2,
  UserIcon,
  UserPlus2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import type * as RPNInput from "react-phone-number-input";
import { toast } from "sonner";

import { StudentStatus } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Separator } from "@repo/ui/components/separator";
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import type { RouterOutputs } from "@repo/api";
import { decode } from "entities";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { SimpleTooltip } from "~/components/simple-tooltip";

import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { breadcrumbAtom } from "~/lib/atoms";
import { useSession } from "~/providers/AuthProvider";
import { api } from "~/trpc/react";
import { getFullName } from "../../utils/full-name";
import { SearchCombobox } from "../SearchCombobox";
import { CountryComponent } from "../shared/CountryPicker";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { CreateEditUser } from "../users/CreateEditUser";
import { SquaredAvatar } from "./SquaredAvatar";

export function StudentHeader({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const router = useRouter();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  //const studentQuery = api.student.get.useQuery(params.id);
  const utils = api.useUtils();

  const canCreateStudent = useCheckPermission(
    "student",
    PermissionAction.CREATE
  );
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);

  useEffect(() => {
    setBreadcrumbs([
      { name: t("home"), url: "/" },
      { name: t("students"), url: "/students" },
      {
        name: decode(student.lastName ?? student.firstName ?? ""),
        url: `/students/${student.id}`,
      },
    ]);
  }, [student, setBreadcrumbs, t]);

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

  const studentStatusMutation = api.student.updateStatus.useMutation({
    onSettled: () => {
      void utils.student.invalidate();
      router.refresh();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const changeStudentStatus = useCallback(
    (status: StudentStatus) => {
      studentStatusMutation.mutate({
        studentId: student.id,
        status,
      });
    },
    [studentStatusMutation, student.id]
  );

  const navigateToStudent = (id: string) => {
    if (!pathname.includes(params.id)) {
      router.push(`${pathname}/${id}/?${createQueryString({})}`);
      return;
    }
    const newPath = pathname.replace(params.id, id);
    router.push(`${newPath}/?${createQueryString({})}`);
  };
  const confirm = useConfirm();

  //const student = studentQuery.data;

  //const studentTags = JSON.stringify(student?.tags ?? []);

  const canDeleteStudent = useCheckPermission(
    "student",
    PermissionAction.DELETE
  );
  const canEditStudent = useCheckPermission("student", PermissionAction.UPDATE);
  //const [open, setOpen] = React.useState(false);

  const { user } = useSession();

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(getFullName(student));
  const [search, setSearch] = useState("");
  const students = api.student.search.useQuery({
    query: search,
  });

  return (
    <div className="flex border-b bg-muted/50 py-1 px-4 w-full gap-1">
      <SquaredAvatar student={student} />
      <div className="flex w-full flex-col gap-1">
        {user?.profile == "student" ? (
          <span className="bg-background h-9 px-4 py-2 rounded-md font-semibold w-full text-sm 2xl:w-[450px]">
            {getFullName(student)}
          </span>
        ) : user?.profile == "contact" ? (
          <StudentSelector
            onChange={(val) => {
              if (val) {
                router.push(routes.students.details(val));
              }
            }}
            defaultValue={student.id}
            className="w-full lg:w-1/3"
          />
        ) : (
          <SearchCombobox
            className="w-full lg:w-1/3"
            items={
              students.data?.map((stud) => ({
                value: stud.id,
                label: getFullName(stud),
              })) ?? []
            }
            value={value}
            label={label}
            onSelect={(value, label) => {
              setValue(value);
              setLabel(label ?? "");
              navigateToStudent(value);
            }}
            onSearchChange={setSearch}
            searchPlaceholder={t("search") + " ..."}
            noResultsMsg={t("no_results")}
            selectItemMsg={t("select_an_option")}
          />
        )}

        <div className="flex flex-row items-center gap-1">
          <FlatBadge
            variant={
              student.status == StudentStatus.ACTIVE
                ? "green"
                : student.status == StudentStatus.INACTIVE
                  ? "yellow"
                  : "red"
            }
          >
            {t(`${student.status}`)}
          </FlatBadge>

          {canEditStudent && (
            <>
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              <Button
                disabled={!canEditStudent}
                size={"icon"}
                onClick={() => {
                  router.push(routes.students.edit(student.id));
                }}
                aria-label={t("edit")}
                variant="ghost"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <SimpleTooltip content="Notification reçus">
            <Button size={"icon"} aria-label="Notification" variant="ghost">
              <BellRing className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content={t("user")}>
            <Button
              onClick={() => {
                router.push(`/users/${student.userId}`);
              }}
              size={"icon"}
              aria-label="user"
              variant="ghost"
            >
              <UserIcon className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
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
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
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
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <SimpleTooltip content="Impressions">
            <Button
              size={"icon"}
              aria-label="print"
              variant="ghost"
              onClick={() => {
                window.open(
                  `/api/pdfs/student/${params.id}?format=pdf`,
                  "_blank"
                );
              }}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          {canCreateStudent && (
            <>
              <SimpleTooltip content={t("add")}>
                <Button
                  size={"icon"}
                  aria-label="add"
                  variant="ghost"
                  onClick={() => {
                    router.push(routes.students.create);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
            </>
          )}

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
              <DropdownInvitation
                entityId={student.id}
                entityType="student"
                email={student.email}
              />
              <DropdownMenuSeparator />
              <DropdownHelp />
              <DropdownMenuSeparator />
              {!student.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("attach_user"),
                      view: (
                        <CreateEditUser entityId={params.id} type="student" />
                      ),
                    });
                  }}
                >
                  <UserPlus2 />
                  {t("attach_user")}
                </DropdownMenuItem>
              )}
              {student.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    if (!student.userId) return;
                    openModal({
                      title: t("change_password"),
                      view: (
                        <CreateEditUser
                          userId={student.userId}
                          type="student"
                          entityId={params.id}
                          username={student.user?.username}
                        />
                      ),
                    });
                  }}
                >
                  <KeyRound />
                  {t("change_password")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>{t("status")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      disabled={
                        user?.profile == "student" || user?.profile == "contact"
                      }
                      onSelect={() => {
                        void changeStudentStatus(StudentStatus.ACTIVE);
                      }}
                    >
                      <ShieldCheck />
                      <span>{t("active")}</span>
                      {student.status == StudentStatus.ACTIVE && <CheckIcon />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        user?.profile == "student" || user?.profile == "contact"
                      }
                      onSelect={() => {
                        void changeStudentStatus(StudentStatus.INACTIVE);
                      }}
                    >
                      <Shield />
                      <span>{t("inactive")}</span>
                      {student.status == StudentStatus.INACTIVE && (
                        <CheckIcon />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={
                        user?.profile == "student" || user?.profile == "contact"
                      }
                      onSelect={() => {
                        void changeStudentStatus(StudentStatus.GRADUATED);
                      }}
                    >
                      <ShieldEllipsis />
                      <span>{t("graduated")}</span>
                      {student.status == StudentStatus.GRADUATED && (
                        <CheckIcon />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        user?.profile == "student" || user?.profile == "contact"
                      }
                      onSelect={() => {
                        void changeStudentStatus(StudentStatus.EXPELLED);
                      }}
                    >
                      <ShieldX />
                      <span>{t("expelled")}</span>
                      {student.status == StudentStatus.EXPELLED && (
                        <CheckIcon />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* <DropdownMenuItem
                onSelect={() => {
                  toast.loading(t("updating"), { id: 0 });
                  disableStudentMutation.mutate({
                    id: student.id,
                    isActive: !student.isActive,
                  });
                }}
              >
                <ShieldBan />
                {student.isActive ? t("disable") : t("enable")}
              </DropdownMenuItem> */}
              {canEditStudent && (
                <DropdownMenuItem
                  onSelect={() => {
                    router.push(routes.students.edit(student.id));
                  }}
                >
                  <PencilIcon />
                  {t("edit")}
                </DropdownMenuItem>
              )}
              {canDeleteStudent && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      const isConfirm = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                        icon: <Trash2 className="h-4 w-4 text-destructive" />,
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
                    variant="destructive"
                    className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  >
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 flex-row items-center gap-4 text-sm font-semibold md:flex">
          {student.registrationNumber && (
            <div className="flex flex-row items-center gap-2 rounded dark:bg-secondary">
              <NotebookTabs className="h-4 w-4 text-foreground" />
              <span> {student.registrationNumber}</span>
            </div>
          )}
          {student.classroom && (
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

          {student.phoneNumber && (
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

          {student.isRepeating && (
            <FlatBadge variant={"red"}>{t("repeating")}</FlatBadge>
          )}
          <FlatBadge
            variant={student.gender == "female" ? "pink" : "blue"}
            className="flex flex-row items-center gap-1"
          >
            {student.gender == "male" ? (
              <PiGenderMaleThin className="h-4 w-4" />
            ) : (
              <PiGenderFemaleThin className="h-4 w-4" />
            )}
            {t(student.gender ?? "male")}
          </FlatBadge>

          {student.countryId && (
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
      </div>
    </div>
  );
}
