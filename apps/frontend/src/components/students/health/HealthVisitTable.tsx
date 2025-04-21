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

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { HealthVisitDetails } from "./HealthVisitDetails";

export function HealthVisitTable({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const { t, i18n } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: visits } = useSuspenseQuery(
    trpc.health.visits.queryOptions({ userId: userId })
  );
  const { openSheet } = useSheet();
  const { openModal } = useModal();

  const deleteHealthVisit = useMutation(
    trpc.health.deleteVisit.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.visits.pathFilter());
        toast.success(t("deleted"), { id: 0 });
      },
    })
  );
  const confirm = useConfirm();

  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
            {visits.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            )}
            {visits.map((visit, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{dateFormat.format(visit.date)}</TableCell>
                  <TableCell>{visit.complaint}</TableCell>
                  <TableCell>{visit.assessment}</TableCell>
                  <TableCell>{visit.examination}</TableCell>
                  <TableCell>{visit.signs}</TableCell>
                  <TableCell className="text-right">
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
                            <MailIcon className="h-4 w-4" />
                            {t("send_message")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              openSheet({
                                view: (
                                  <CreateEditHealthVisit
                                    name={name}
                                    userId={userId}
                                  />
                                ),
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
