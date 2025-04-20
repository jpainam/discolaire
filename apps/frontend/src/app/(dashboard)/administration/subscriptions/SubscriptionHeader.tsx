"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Mail,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  PlusIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubscription } from "./CreateEditSubscription";
export function SubscriptionHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: totals } = useSuspenseQuery(
    trpc.subscription.count.queryOptions()
  );

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.clearAll.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.subscription.count.pathFilter()
        );
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
                openSheet({
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

              {canDeleteSubscription && (
                <>
                  <DropdownMenuSeparator />
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SMS</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.sms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totals.unlimitedSms} users with unlimited SMS
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total WhatsApp
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.whatsapp}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totals.unlimitedWhatsapp} users with unlimited WhatsApp
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.email}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totals.unlimitedEmail} users with unlimited Email
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
