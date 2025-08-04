"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

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
          trpc.accountingJournal.stats.pathFilter(),
        );
      },
    }),
  );

  const handleSync = () => {
    toast.loading("syncing_fees", { id: 0 });
    updateOldFees.mutate();
  };
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-4 py-2">
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
            size="sm"
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        {canCreateFees && (
          <Button
            isLoading={updateOldFees.isPending}
            onClick={() => {
              handleSync();
            }}
            size={"sm"}
            variant={"destructive"}
          >
            Synchroniser
          </Button>
        )}
      </div>
    </div>
  );
}
