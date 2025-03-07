"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { CreateEditTerm } from "./CreateEditTerm";

export function TermTable() {
  const termsQuery = api.term.all.useQuery();
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const utils = api.useUtils();

  const deleteTermMutation = api.term.delete.useMutation({
    onSettled: () => utils.term.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("start_date")}</TableHead>
              <TableHead>{t("end_date")}</TableHead>
              <TableHead>{t("is_active")}</TableHead>
              <TableHead>{t("school_year")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {termsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {termsQuery.data?.map((term) => {
              return (
                <TableRow key={term.id}>
                  <TableCell className="py-0">{term.name}</TableCell>
                  <TableCell className="py-0">
                    {term.startDate && fullDateFormatter.format(term.startDate)}
                  </TableCell>
                  <TableCell className="py-0">
                    {term.endDate && fullDateFormatter.format(term.endDate)}
                  </TableCell>
                  <TableCell className="py-0">
                    <FlatBadge variant={term.isActive ? "green" : "gray"}>
                      {term.isActive ? t("yes") : t("no")}
                    </FlatBadge>
                  </TableCell>
                  <TableCell className="py-0">{term.schoolYearId}</TableCell>
                  <TableCell className="py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            openModal({
                              title: t("edit"),
                              view: <CreateEditTerm term={term} />,
                            });
                          }}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={async () => {
                            const isConfirm = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                              icon: <Trash2 className="h-4 w-4" />,
                              alertDialogTitle: {
                                className: "flex items-center gap-2",
                              },
                            });
                            if (isConfirm) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteTermMutation.mutate(term.id);
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
