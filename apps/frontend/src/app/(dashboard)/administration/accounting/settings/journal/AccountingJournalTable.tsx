"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PencilIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { EmptyComponent } from "~/components/EmptyComponent";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateJournal } from "./CreateUpdateJournal";

export function AccountingJournalTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.stats.queryOptions(),
  );

  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const deleteAccountingJournal = useMutation(
    trpc.accountingJournal.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accountingJournal.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.accountingJournal.stats.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const confirm = useConfirm();
  const canUpdateFees = useCheckPermission("fee", PermissionAction.UPDATE);
  const canDeleteFees = useCheckPermission("fee", PermissionAction.DELETE);
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("Label")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("fees")}</TableHead>
              <TableHead>{t("transactions")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead className="w-[100px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyComponent title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
            {journals.map((journal) => {
              return (
                <TableRow key={journal.id}>
                  <TableCell className="font-medium">{journal.name}</TableCell>
                  <TableCell>{journal.description}</TableCell>
                  <TableCell>{journal.feesCount}</TableCell>
                  <TableCell>{journal.transactionsCount}</TableCell>
                  <TableCell>
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-row items-center gap-2">
                      {canUpdateFees && (
                        <Button
                          onClick={() => {
                            openModal({
                              title: t("update"),
                              view: <CreateUpdateJournal item={journal} />,
                            });
                          }}
                          variant="outline"
                          size="icon"
                          className="size-7"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                      )}
                      {canDeleteFees && (
                        <Button
                          disabled={
                            journal.feesCount > 0 ||
                            journal.transactionsCount > 0
                          }
                          onClick={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirmed) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteAccountingJournal.mutate(journal.id);
                            }
                          }}
                          variant="destructive"
                          size="icon"
                          className="size-7"
                        >
                          <Trash className="h-3 w-3" />
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
