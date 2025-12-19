"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LockIcon, LockOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CalendarIcon, DeleteIcon, EditIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditTerm } from "./CreateEditTerm";

const periodTypeColors = {
  MONTHLY:
    "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  QUARTER:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  HALF: "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  ANNUAL:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

export function TermTable() {
  const trpc = useTRPC();
  const termsQuery = useQuery(trpc.term.all.queryOptions());

  const t = useTranslations();
  const locale = useLocale();

  const { openModal } = useModal();
  const confirm = useConfirm();

  const queryClient = useQueryClient();
  const updateTermActiveMutation = useMutation(
    trpc.term.lock.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );

  const deleteTermMutation = useMutation(
    trpc.term.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const terms = termsQuery.data ?? [];
  const canDeleteTerm = useCheckPermission("term", PermissionAction.DELETE);
  return (
    <div className="">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>Type</TableHead>
              <TableHead> Date Range</TableHead>
              <TableHead>Composition</TableHead>
              <TableHead>{t("is_active")}</TableHead>
              <TableHead>{t("school_year")}</TableHead>
              <TableHead>{t("isActive")}</TableHead>
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
            {terms.map((term) => {
              return (
                <TableRow key={term.id}>
                  <TableCell>
                    {term.name} ({term.shortName})
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("uppercase", periodTypeColors[term.type])}
                    >
                      {t(term.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <CalendarIcon />
                      <span>
                        {term.startDate.toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {term.endDate.toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {term.parts.length > 0 ? (
                      <div className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {term.parts.slice(0, 3).map((part) => {
                            const partPeriod = terms.find(
                              (p) => p.id === part.childId,
                            );
                            return partPeriod ? (
                              <Badge
                                key={`${part.childId}-${term.id}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {partPeriod.name}
                              </Badge>
                            ) : null;
                          })}
                          {term.parts.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{term.parts.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={"outline"}
                      className={cn(
                        !term.isActive ? "bg-red-500 text-white" : "",
                      )}
                    >
                      {term.isActive ? t("yes") : t("no")}
                    </Badge>
                  </TableCell>

                  <TableCell>{term.schoolYear.name}</TableCell>
                  <TableCell>
                    <Button
                      size={"sm"}
                      //isLoading={updateTermActiveMutation.isPending}
                      onClick={() => {
                        toast.loading(t("Processing"), { id: 0 });
                        updateTermActiveMutation.mutate({
                          id: term.id,
                          isActive: !term.isActive,
                        });
                      }}
                      variant={term.isActive ? "secondary" : "destructive"}
                    >
                      {term.isActive ? <LockIcon /> : <LockOpen />}
                      {term.isActive ? t("Lock") : t("Unlock")}
                    </Button>
                  </TableCell>
                  <TableCell className="py-0 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          openModal({
                            description: "Update the period details below.",
                            className: "sm:max-w-xl",
                            title: "Edit Period",
                            view: <CreateEditTerm term={term} />,
                          });
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toast.loading(t("Processing"), { id: 0 });
                          updateTermActiveMutation.mutate({
                            id: term.id,
                            isActive: !term.isActive,
                          });
                        }}
                      >
                        {term.isActive ? <LockIcon /> : <LockOpen />}
                      </Button>
                      {!canDeleteTerm && (
                        <Button
                          size="icon"
                          onClick={async () => {
                            const isConfirm = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                              // icon: <Trash2 className="h-4 w-4" />,
                              // alertDialogTitle: {
                              //   className: "flex items-center gap-2",
                              // },
                            });
                            if (isConfirm) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteTermMutation.mutate(term.id);
                            }
                          }}
                          variant="destructive"
                        >
                          <DeleteIcon />
                        </Button>
                      )}
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
