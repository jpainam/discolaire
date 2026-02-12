"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  MessageCircle,
  MessageSquare,
  MoreVertical,
  PlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { ContactIcon, DeleteIcon, MailIcon, UsersIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubscription } from "./CreateEditSubscription";

export function SubscriptionHeader() {
  const t = useTranslations();
  const { openSheet } = useSheet();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: totals } = useSuspenseQuery(
    trpc.notificationSubscription.count.queryOptions(),
  );

  const deleteSubscriptionMutation = useMutation(
    trpc.notificationSubscription.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.count.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const canCreateSubscription = useCheckPermission("subscription.create");
  const canDeleteSubscription = useCheckPermission("subscription.delete");
  const totalData = [
    {
      title: "Staff",
      value: totals.sms,
      icon: <UsersIcon />,
      unlimited: totals.unlimitedSms,
      textColor: "text-violet-600",
    },
    {
      title: "Contact",
      value: totals.sms,
      icon: <ContactIcon />,
      unlimited: totals.unlimitedSms,
      textColor: "text-green-600",
    },
    {
      title: "SMS",
      value: totals.sms,
      icon: <MessageSquare className="text-muted-foreground h-4 w-4" />,
      unlimited: totals.unlimitedSms,
      textColor: "text-red-600",
    },
    {
      title: "WhatsApp",
      value: totals.whatsapp,
      icon: <MessageCircle className="text-muted-foreground h-4 w-4" />,
      unlimited: totals.unlimitedWhatsapp,
      textColor: "text-yellow-600",
    },
    {
      title: "Email",
      value: totals.email,
      icon: <MailIcon />,
      unlimited: totals.unlimitedEmail,
      textColor: "text-cyan-600",
    },
  ];

  // const updateAttendance = async () => {
  //   const r = await sync_attendance();
  //   toast.success(`${r} attendance updated`, { id: 0 });
  // };
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
            >
              <PlusIcon />
              {t("create")}
            </Button>
          )}
          {/* <Button
            size={"sm"}
            onClick={async () => {
              toast.loading(t("Processing"), { id: 0 });
              await syncTransactions();
            }}
          >
            Sync transactions
          </Button> */}
          {/* <Button
            onClick={async () => {
              toast.loading(t("Processing"), { id: 0 });
              await updateAttendance();
            }}
          >
            Sync attendance
          </Button> */}
          {/* <Button
            onClick={async () => {
              const r = await find_missing_transaction2();
              console.log(r);
            }}
          >
            50 Derniere transactions
          </Button> */}
          {/* <Button
            size={"sm"}
            onClick={async () => {
              toast.loading(t("Processing"), { id: 0 });
              await updateStudentStatus();
            }}
          >
            Update expelled students
          </Button> */}
          {/* <Button
            onClick={async () => {
              toast.loading(t("Processing"), { id: 0 });
              await updateFees();
            }}
            size={"sm"}
          >
            Update 2000 Fees
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <MoreVertical />
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
                      await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),

                        onConfirm: async () => {
                          toast.loading(t("Processing"), { id: 0 });
                          await deleteSubscriptionMutation.mutateAsync([]);
                        },
                      });
                    }}
                    variant="destructive"
                  >
                    <DeleteIcon />
                    {t("clear_all")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-4 pt-2 md:grid-cols-5">
        {totalData.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>Total {item.title}</CardTitle>
              <CardDescription>{item.unlimited} illimité</CardDescription>
              <CardAction>{item.icon}</CardAction>
            </CardHeader>
            <CardContent>
              <span className={cn("text-3xl", item.textColor)}>
                {item.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
