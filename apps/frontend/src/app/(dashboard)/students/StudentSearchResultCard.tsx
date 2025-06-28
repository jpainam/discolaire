"use client";
import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import {
  Calendar,
  CalendarDays,
  Edit,
  Eye,
  GraduationCap,
  HeartPlus,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AvatarState } from "~/components/AvatarState";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
export function StudentSearchResultCard({
  student,
}: {
  student: RouterOutputs["student"]["search"][number];
}) {
  const { t } = useLocale();
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  return (
    <Card
      key={student.id}
      className="py-2 shadow-none transition-shadow hover:bg-muted/50"
    >
      <CardContent className="px-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <AvatarState
              pos={getFullName(student).length}
              avatar={student.user?.avatar}
              className="h-12 w-12"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={`/students/${student.id}`}
                  className="text-sm hover:underline hover:text-blue-600"
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
                    {t(`${student.status.toUpperCase()}`)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-red-500"
                      aria-hidden="true"
                    ></span>
                    {t(`${student.status.toUpperCase()}`)}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs">
                    {student.dateOfBirth?.toLocaleDateString(i18next.language, {
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
                    {student.createdAt.toLocaleDateString(i18next.language, {
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
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  toast.warning("This feature is not implemented yet.");
                  //router.push(`/students/${student.id}/favorite`);
                }}
              >
                <HeartPlus className=" h-4 w-4" />
                {t("Favorite")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}`);
                }}
              >
                <Eye className=" h-4 w-4" />
                {t("View Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/edit`);
                }}
              >
                <Edit className="h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/attendances`);
                }}
              >
                <Calendar className="h-4 w-4" />
                {t("View Attendance")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/students/${student.id}/grades`);
                }}
              >
                <GraduationCap className=" h-4 w-4" />
                {t("View Grades")}
              </DropdownMenuItem>
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
                <Trash2 className=" h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
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
