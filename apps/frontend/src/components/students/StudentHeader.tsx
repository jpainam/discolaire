"use client";

import type * as RPNInput from "react-phone-number-input";
import { useParams, usePathname } from "next/navigation";
import {
  BellRing,
  MessageCircleMore,
  MoreVertical,
  NotebookTabs,
  Pencil,
  Phone,
  Printer,
  ShieldBan,
  SquareEqual,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
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
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { CountryComponent } from "../shared/CountryPicker";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { StudentSelector } from "../shared/selects/StudentSelector2";
import CreateEditStudent from "./CreateEditStudent";
import { SquaredAvatar } from "./SquaredAvatar";

interface StudentHeaderProps {
  className?: string;
}

export function StudentHeader({ className }: StudentHeaderProps) {
  const router = useRouter();
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const params = useParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(params.id);

  const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();

  const navigateToStudent = (id: string) => {
    if (!pathname.includes(params.id)) {
      router.push(`${pathname}/${id}/?${createQueryString({})}`);
      return;
    }
    const newPath = pathname.replace(params.id, id);
    router.push(`${newPath}/?${createQueryString({})}`);
  };

  const student = studentQuery.data;
  const studentTags = JSON.stringify(student?.tags ?? []);

  return (
    <header className={cn(className)}>
      <div className="flex w-full gap-1">
        <SquaredAvatar student={student ?? undefined} />
        <div className="flex w-full flex-col gap-1">
          <StudentSelector
            className="w-full md:w-[500px]"
            defaultValue={params.id}
            onChange={(val) => {
              if (val) {
                navigateToStudent(val);
              }
            }}
          />
          {studentQuery.isPending && (
            <>
              <Skeleton className="h-8 w-full lg:w-[25%]" />
              <Skeleton className="h-8 w-full lg:w-[35%]" />
            </>
          )}
          {!studentQuery.isPending && (
            <div className="flex flex-row items-center gap-1">
              {studentQuery.data?.isActive ? (
                <FlatBadge variant={"green"}>Active</FlatBadge>
              ) : (
                <FlatBadge variant={"red"}>Deactiver</FlatBadge>
              )}
              <Separator orientation="vertical" className="h-4" />
              <Button
                size={"icon"}
                onClick={() => {
                  if (!student) return;
                  openSheet({
                    className: "w-[700px]",
                    title: (
                      <div className="px-2">
                        {t("edit")} {getFullName(student)}
                      </div>
                    ),
                    view: <CreateEditStudent student={student} />,
                  });
                }}
                aria-label={t("edit")}
                variant="ghost"
              >
                <Pencil className="h-4 w-4" />
              </Button>
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
                  <DropdownMenuItem>
                    <ShieldBan className="mr-2 h-4 w-4" />
                    {t("disable")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
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
                  <span className="line-clamp-1">
                    {" "}
                    {student.classroom.shortName}
                  </span>
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

              <FlatBadge
                variant={student?.gender == "female" ? "pink" : "blue"}
                className="flex h-5 w-[85px] flex-row items-center gap-1"
              >
                {student?.gender == "male" ? (
                  <PiGenderMaleThin className="h-4 w-4" />
                ) : (
                  <PiGenderFemaleThin className="h-4 w-4" />
                )}
                {t(student?.gender ?? "male")}
              </FlatBadge>

              {student?.tags && (
                <div className="flex flex-row items-center gap-1 rounded dark:bg-secondary">
                  <Tags className="h-4 w-4 text-foreground" />
                  <span>{studentTags}</span>
                </div>
              )}
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
