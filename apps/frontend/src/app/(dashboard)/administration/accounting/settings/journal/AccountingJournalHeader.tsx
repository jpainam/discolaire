/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateJournal } from "./CreateUpdateJournal";

export function AccountingJournalHeader() {
  const canCreateFees = useCheckPermission("fee", PermissionAction.CREATE);
  const { openModal } = useModal();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateOldFees = useMutation(
    trpc.accountingJournal.syncOldFees.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        toast.success("Frais synced successfully", { id: 0 });
        await queryClient.invalidateQueries(
          trpc.accountingJournal.pathFilter(),
        );
      },
    }),
  );

  const insertTDMutation = useMutation(
    trpc.accountingJournal.insertTDTransactions.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (r) => {
        toast.success(`${r} transactions inserted successfully`, { id: 0 });
        await queryClient.invalidateQueries(
          trpc.accountingJournal.pathFilter(),
        );
      },
    }),
  );

  const deplacerMutation = useMutation(
    trpc.accountingJournal.deplacer.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        toast.success("Transactions moved successfully", { id: 0 });
        await queryClient.invalidateQueries(
          trpc.accountingJournal.pathFilter(),
        );
      },
    }),
  );

  const handleSync = () => {
    toast.loading("syncing_fees", { id: 0 });
    updateOldFees.mutate();
  };
  return (
    <div className="flex flex-row items-center justify-between gap-2 pb-2">
      <Label>{t("Accounting Journals")}</Label>
      <div className="flex items-center justify-end gap-2">
        {canCreateFees && (
          <Button
            onClick={() => {
              openModal({
                title: t("create"),
                view: <CreateUpdateJournal />,
              });
            }}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        {/* {canCreateFees && (
          <Button
            disabled={updateOldFees.isPending}
            onClick={() => {
              handleSync();
            }}
          
            variant={"destructive"}
          >
            Synchroniser
          </Button>
        )}
        <Button
          
          onClick={() => {
            toast.loading("Inserting TD transactions", { id: 0 });
            insertTDMutation.mutate();
          }}
        >
          Inserer TD
        </Button>
        <Button
          onClick={() => {
            toast.loading("Moving transactions", { id: 0 });
            deplacerMutation.mutate();
          }}
        >
          Deplacer
        </Button> */}
      </div>
    </div>
  );
}
