"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { DatePicker } from "~/components/DatePicker";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
import { DeleteIcon, EditIcon, MailIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StaffAttendanceTable() {
  const t = useTranslations();
  const [staffId] = useQueryState("staffId");
  const trpc = useTRPC();
  const { data: attendances, isPending } = useQuery(
    trpc.staffAttendance.all.queryOptions({
      staffId: staffId ?? undefined,
    }),
  );
  const queryClient = useQueryClient();
  const deleteStaffAttendance = useMutation(
    trpc.staffAttendance.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staffAttendance.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const canDeleteStaffAttendance = useCheckPermission(
    "staff.attendance.delete",
  );
  const canUpateStaffAttendance = useCheckPermission("staff.attendance.update");

  const locale = useLocale();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <InputGroup className="flex-1">
            <InputGroupInput placeholder={t("search")} />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <DatePicker className="w-[200px]" />
        </div>
        {/* <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Date</TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>H. Arrivée</TableHead>
              <TableHead>H. Départ</TableHead>
              <TableHead>Observation</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, t) => {
                return (
                  <TableRow key={t}>
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : attendances?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyComponent
                    title="Aucune présences"
                    description="Commencer par saisir quelques présences"
                  />
                </TableCell>
              </TableRow>
            ) : (
              attendances?.map((at, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {at.date.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Link
                        className="hover:underline"
                        href={`/staffs/${at.staffId}`}
                      >
                        {getFullName(at.staff)}
                      </Link>
                    </TableCell>
                    <TableCell>{at.staff.jobTitle}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          at.status == "absent"
                            ? "destructive"
                            : at.status == "present"
                              ? "success"
                              : at.status == "late"
                                ? "warning"
                                : at.status == "mission"
                                  ? "info"
                                  : "secondary"
                        }
                        appearance={"light"}
                      >
                        {t(at.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {at.startDate.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                        minute: "numeric",
                        hour: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {at.endDate.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                        minute: "numeric",
                        hour: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{at.observation}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={"icon-sm"} variant={"ghost"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MailIcon />
                            {t("mail")}
                          </DropdownMenuItem>
                          {canUpateStaffAttendance && (
                            <DropdownMenuItem>
                              <EditIcon />
                              {t("edit")}
                            </DropdownMenuItem>
                          )}

                          {canDeleteStaffAttendance && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={async () => {
                                  await confirm({
                                    title: t("delete"),
                                    description: t("delete_confirmation"),

                                    onConfirm: async () => {
                                      toast.loading(t("Processing"), { id: 0 });
                                      await deleteStaffAttendance.mutateAsync(
                                        at.id,
                                      );
                                    },
                                  });
                                }}
                              >
                                <DeleteIcon />
                                {t("delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
