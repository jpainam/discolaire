"use client";

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

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
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
    trpc.subscription.count.queryOptions(),
  );

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.clearAll.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.subscription.count.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const canCreateSubscription = useCheckPermission(
    "subscription",
    PermissionAction.CREATE,
  );
  const canDeleteSubscription = useCheckPermission(
    "subscription",
    PermissionAction.DELETE,
  );
  const totalData = [
    {
      title: "SMS",
      value: totals.sms,
      icon: <MessageSquare className="text-muted-foreground h-4 w-4" />,
      unlimited: totals.unlimitedSms,
    },
    {
      title: "WhatsApp",
      value: totals.whatsapp,
      icon: <MessageCircle className="text-muted-foreground h-4 w-4" />,
      unlimited: totals.unlimitedWhatsapp,
    },
    {
      title: "Email",
      value: totals.email,
      icon: <Mail className="text-muted-foreground h-4 w-4" />,
      unlimited: totals.unlimitedEmail,
    },
  ];
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <Label className="hidden md:block">{t("subscriptions")}</Label>
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
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      <div className="grid gap-4 pt-2 md:grid-cols-3">
        {totalData.map((item) => (
          <Card key={item.title} className="gap-2">
            <CardHeader>
              <CardTitle>Total {item.title}</CardTitle>
              <CardAction>{item.icon}</CardAction>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{item.value}</div>
              <p className="text-muted-foreground text-xs">
                {t("users_with_unlimited", {
                  unlimited: item.unlimited,
                  title: item.title,
                })}
                {/* {item.unlimited} users with unlimited {item.title} */}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
