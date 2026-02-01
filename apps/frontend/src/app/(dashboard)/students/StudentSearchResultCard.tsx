"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { AvatarState } from "~/components/AvatarState";
import { UpdateRegistrationNumber } from "~/components/students/UpdateRegistrationNumber";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import {
  DeleteIcon,
  EditIcon,
  GradeIcon,
  HeartIcon,
  IDCardIcon,
  ViewIcon,
} from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentSearchResultCard({
  student,
}: {
  student: RouterOutputs["student"]["all"][number];
}) {
  const t = useTranslations();
  const router = useRouter();

  const trpc = useTRPC();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const canDeleteStudent = useCheckPermission("student.delete");
  const canUpdateStudent = useCheckPermission("student.update");

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <Card
      key={student.id}
      className="hover:bg-muted/50 py-2 shadow-none transition-shadow"
    >
      <CardContent className="px-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <AvatarState
              pos={getFullName(student).length}
              avatar={student.avatar}
              className="h-12 w-12"
            />

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <Link
                  href={`/students/${student.id}`}
                  className="text-sm hover:text-blue-600 hover:underline"
                >
                  {getFullName(student)}
                </Link>
                <Badge variant="outline" className="text-xs">
                  {student.registrationNumber ?? "N/A"}
                </Badge>
                {student.status == "ACTIVE" ? (
                  <Badge variant="outline" className="gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    ></span>
                    {t(`${student.status.toLowerCase()}`)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-red-500"
                      aria-hidden="true"
                    ></span>
                    {t(`${student.status.toLowerCase()}`)}
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-4">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs">
                    {student.dateOfBirth?.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {student.classroom?.name && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs">{student.classroom.name}</span>
                  </div>
                )}
                <EmailComponent email={student.user?.email} />

                {student.phoneNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs">{student.phoneNumber}</span>
                  </div>
                )}
                {/* <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t("enrolled")}:{" "}
                    {student.createdAt.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div> */}

                {student.residence && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">{student.residence}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  toast.warning("This feature is not implemented yet.");
                  //router.push(`/students/${student.id}/favorite`);
                }}
              >
                <HeartIcon />
                {t("Favorite")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}`);
                }}
              >
                <ViewIcon />
                {t("View Profile")}
              </DropdownMenuItem>
              {canUpdateStudent && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: "Modifier matricule",
                      description: getFullName(student),
                      view: <UpdateRegistrationNumber student={student} />,
                    });
                  }}
                >
                  <IDCardIcon />
                  Modifier matricule
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/edit`);
                }}
              >
                <EditIcon />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/attendances`);
                }}
              >
                <CalendarDays />
                {t("View Attendance")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/grades`);
                }}
              >
                <GradeIcon />
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
                          name: getFullName(student),
                        }),
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteStudentMutation.mutate(student.id);
                      }
                    }}
                    variant="destructive"
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function EmailComponent({ email }: { email?: string | null }) {
  if (
    !email ||
    email.includes("@example.com") ||
    email.includes("@discolaire.com")
  )
    return null;
  return (
    <div className="flex items-center gap-1.5">
      <Mail className="h-4 w-4" />
      <span>{email}</span>
    </div>
  );
}
