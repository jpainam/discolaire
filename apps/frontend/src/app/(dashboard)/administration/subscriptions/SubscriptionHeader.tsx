"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubscription } from "./CreateEditSubscription";

export function SubscriptionHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.clearAll.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const confirm = useConfirm();
  const canCreateSubscription = useCheckPermission(
    "subscription",
    PermissionAction.CREATE
  );
  const canDeleteSubscription = useCheckPermission(
    "subscription",
    PermissionAction.DELETE
  );
  return (
    <div className="py-2 px-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">{t("subscriptions")}</Label>
        <div className="flex items-center gap-2">
          {canCreateSubscription && (
            <Button
              onClick={() => {
                openModal({
                  title: `${t("add")} - ${t("subscription")}`,
                  view: <CreateEditSubscription />,
                });
              }}
              size={"sm"}
            >
              <PlusIcon />
              {t("create")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"} className="size-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <XMLIcon />
                {t("xml_export")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {canDeleteSubscription && (
                <DropdownMenuItem
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("Processing..."), { id: 0 });
                      deleteSubscriptionMutation.mutate();
                    }
                  }}
                  variant="destructive"
                >
                  <Trash2 />
                  {t("clear_all")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
