"use client";

import {
  BellRing,
  CheckIcon,
  ImageMinusIcon,
  ImagePlusIcon,
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
  XIcon,
} from "lucide-react";
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
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { decode } from "entities";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { SimpleTooltip } from "~/components/simple-tooltip";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { breadcrumbAtom } from "~/lib/atoms";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

import { Badge } from "@repo/ui/components/badge";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { authClient } from "~/auth/client";
import { AvatarState } from "../AvatarState";
import { SearchCombobox } from "../SearchCombobox";
import { CountryComponent } from "../shared/CountryPicker";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { ChangeAvatarButton } from "../users/ChangeAvatarButton";
import { CreateEditUser } from "../users/CreateEditUser";
import { SuccessProbability } from "./SuccessProbability";

export function StudentHeader() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: student } = useSuspenseQuery(
    trpc.student.get.queryOptions(params.id),
  );
  const router = useRouter();
  const { t } = useLocale();

  const queryClient = useQueryClient();

  const canCreateStudent = useCheckPermission(
    "student",
    PermissionAction.CREATE,
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

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(routes.students.index);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { openModal } = useModal();

  const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();

  const studentStatusMutation = useMutation(
    trpc.student.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const changeStudentStatus = useCallback(
    (status: StudentStatus) => {
      toast.loading(t("Processing..."), { id: 0 });
      studentStatusMutation.mutate({
        studentId: student.id,
        status,
      });
    },
    [t, studentStatusMutation, student.id],
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

  const canDeleteStudent = useCheckPermission(
    "student",
    PermissionAction.DELETE,
  );
  const canEditStudent = useCheckPermission("student", PermissionAction.UPDATE);
  const { data: session } = authClient.useSession();

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(getFullName(student));
  const [search, setSearch] = useState("");
  const studentsQuery = useQuery(
    trpc.student.search.queryOptions({
      query: search,
    }),
  );

  const handleDeleteAvatar = async (userId: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const response = await fetch("/api/upload/avatars", {
      method: "DELETE",
      body: JSON.stringify({
        userId: userId,
      }),
    });
    if (response.ok) {
      toast.success(t("deleted_successfully"), {
        id: 0,
      });
      await queryClient.invalidateQueries(trpc.student.get.pathFilter());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };

  return (
    <div className="flex border-b bg-muted/50 py-1 px-4  gap-2">
      <AvatarState
        className="hidden md:flex my-0 h-full w-[100px] rounded-md"
        pos={getFullName(student).length}
        avatar={student.user?.avatar}
      />
      <div className="flex w-full flex-col gap-1">
        {session?.user.profile == "student" ? (
          <span className="bg-background h-9 px-4 py-2 rounded-md font-semibold w-full text-sm 2xl:w-[450px]">
            {getFullName(student)}
          </span>
        ) : session?.user.profile == "contact" ? (
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
              studentsQuery.data?.map((stud) => ({
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
          {canEditStudent && (
            <Button
              disabled={!canEditStudent}
              size={"icon"}
              className="size-7"
              onClick={() => {
                router.push(routes.students.edit(student.id));
              }}
              aria-label={t("edit")}
              variant="ghost"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          <SimpleTooltip content="Notification reçus">
            <Button
              className="size-7"
              size={"icon"}
              aria-label="Notification"
              variant="ghost"
            >
              <BellRing className="h-3 w-3" />
            </Button>
          </SimpleTooltip>
          {student.userId && (
            <SimpleTooltip content={t("user")}>
              <Button
                className="size-7"
                onClick={() => {
                  router.push(`/users/${student.userId}`);
                }}
                size={"icon"}
                aria-label="user"
                variant="ghost"
              >
                <UserIcon className="h-3 w-3" />
              </Button>
            </SimpleTooltip>
          )}
          <SimpleTooltip content="Dialoguer">
            <Button
              size={"icon"}
              className="size-7"
              aria-label="Notification"
              variant="ghost"
              onClick={() => {
                router.push(`${routes.students.notifications(params.id)}`);
              }}
            >
              <MessageCircleMore className="h-3 w-3" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Contacts et Responsables">
            <Button
              size={"icon"}
              className="size-7"
              aria-label="Contacts"
              variant="ghost"
              onClick={() => {
                router.push(routes.students.contacts(params.id));
              }}
            >
              <Users className="h-3 w-3" />
            </Button>
          </SimpleTooltip>

          <SimpleTooltip content="Impressions">
            <Button
              size={"icon"}
              className="size-7"
              aria-label="print"
              variant="ghost"
              onClick={() => {
                window.open(
                  `/api/pdfs/student/${params.id}?format=pdf`,
                  "_blank",
                );
              }}
            >
              <Printer className="h-3 w-3" />
            </Button>
          </SimpleTooltip>

          {canCreateStudent && (
            <SimpleTooltip content={t("add")}>
              <Button
                size={"icon"}
                aria-label="add"
                className="size-7"
                variant="ghost"
                onClick={() => {
                  router.push(routes.students.create);
                }}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </SimpleTooltip>
          )}
          <SimpleTooltip
            content={
              student.user?.avatar ? t("Remove avatar") : t("change_avatar")
            }
          >
            {student.user?.avatar ? (
              <Button
                onClick={() => {
                  if (student.userId) void handleDeleteAvatar(student.userId);
                }}
                variant={"ghost"}
                className="size-7"
                size={"icon"}
              >
                <ImageMinusIcon />
              </Button>
            ) : (
              <>
                {student.userId ? (
                  <ChangeAvatarButton userId={student.userId}>
                    <Button size={"icon"} className="size-7" variant={"ghost"}>
                      <ImagePlusIcon />
                    </Button>
                  </ChangeAvatarButton>
                ) : (
                  <AvatarState pos={1} />
                )}
              </>
            )}
          </SimpleTooltip>
          <SimpleTooltip content={t("Success Probability")}>
            <SuccessProbability />
          </SimpleTooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant="ghost"
                className="size-7"
                onClick={() => {
                  router.push(routes.students.contacts(params.id));
                }}
              >
                <MoreVertical className="h-3 w-3" />
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
                      title: t("create_a_user"),
                      view: (
                        <CreateEditUser entityId={params.id} type="student" />
                      ),
                    });
                  }}
                >
                  <UserPlus2 className="h-3 w-3" />
                  {t("create_a_user")}
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
                  <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t("status")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      disabled={
                        session?.user.profile == "student" ||
                        session?.user.profile == "contact"
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
                        session?.user.profile == "student" ||
                        session?.user.profile == "contact"
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
                        session?.user.profile == "student" ||
                        session?.user.profile == "contact"
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
                        session?.user.profile == "student" ||
                        session?.user.profile == "contact"
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

        <div className="grid grid-cols-3 flex-row items-center gap-4 text-sm font-semibold md:flex">
          {student.registrationNumber && (
            <Badge>
              <NotebookTabs
                className="-ms-0.5 opacity-60"
                size={12}
                aria-hidden="true"
              />
              {student.registrationNumber}
            </Badge>
          )}
          {student.classroom ? (
            <Badge variant="outline" className="gap-1.5">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
              {t("Registered")}
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5">
              <span
                className="size-1.5 rounded-full bg-amber-500"
                aria-hidden="true"
              ></span>
              {t("Not Registered")}
            </Badge>
          )}
          {student.classroom && (
            <Badge variant="outline" className="gap-1.5">
              <SquareEqual
                className="-ms-0.5 opacity-60"
                size={12}
                aria-hidden="true"
              />
              <Link
                href={routes.classrooms.details(student.classroom.id)}
                className="line-clamp-1 hover:underline"
              >
                {student.classroom.name}
              </Link>
            </Badge>
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
          <Badge variant="outline" className="gap-1">
            {student.status == StudentStatus.ACTIVE ? (
              <CheckIcon
                className="text-emerald-500"
                size={12}
                aria-hidden="true"
              />
            ) : (
              <XIcon className="text-yellow-500" size={12} aria-hidden="true" />
            )}
            {t(`${student.status.toLowerCase()}`)}
          </Badge>
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
