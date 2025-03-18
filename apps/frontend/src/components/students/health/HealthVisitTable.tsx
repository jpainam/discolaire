"use client";

import { Eye, MailIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { HealthVisitDetails } from "./HealthVisitDetails";

export function HealthVisitTable({ userId }: { userId: string }) {
  const { t, i18n } = useLocale();

  const { openSheet } = useSheet();
  const { openModal } = useModal();
  const utils = api.useUtils();
  const deleteHealthVisit = api.health.deleteVisit.useMutation({
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted"), { id: 0 });
    },
    onSettled: () => utils.health.invalidate(),
  });
  const confirm = useConfirm();

  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const visitsQuery = api.health.visits.useQuery({ userId: userId });

  return (
    <div className="px-4">
      <div className={cn("rounded-lg border")}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("date_of_visit")}</TableHead>
              <TableHead>{t("chief_complaint")}</TableHead>
              <TableHead>{t("assessment")}</TableHead>
              <TableHead>{t("examination_findings")}</TableHead>
              <TableHead>{t("vital_signs")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="grid w-full grid-cols-6 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {visitsQuery.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            )}
            {visitsQuery.data?.map((visit) => {
              return (
                <TableRow>
                  <TableCell className="py-0">
                    {dateFormat.format(visit.date)}
                  </TableCell>
                  <TableCell className="py-0">{visit.complaint}</TableCell>
                  <TableCell className="py-0">{visit.assessment}</TableCell>
                  <TableCell className="py-0">{visit.examination}</TableCell>
                  <TableCell className="py-0">{visit.signs}</TableCell>
                  <TableCell className="py-0 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              openModal({
                                className: "w-[600px]",
                                view: <HealthVisitDetails />,
                              });
                            }}
                          >
                            <Eye />
                            {t("Details")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MailIcon className="mr-2 h-4 w-4" />
                            {t("send_message")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              openSheet({
                                view: <CreateEditHealthVisit userId={userId} />,
                              });
                            }}
                          >
                            <Pencil />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={async () => {
                              const isConfirmed = await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),
                                icon: <Trash2 className="text-destructive" />,
                                alertDialogTitle: {
                                  className: "flex items-center gap-2",
                                },
                              });
                              if (isConfirmed) {
                                toast.loading(t("deleting"), { id: 0 });
                                deleteHealthVisit.mutate(visit.id);
                              }
                            }}
                            variant="destructive"
                            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                          >
                            <Trash2 />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
