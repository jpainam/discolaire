"use client";

import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { sidebarIcons } from "../sidebar-icons";

export function AccessLogsHeader({ userId }: { userId: string }) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const Icon = sidebarIcons.access_logs;
  const queryClient = useQueryClient();
  const router = useRouter();
  const canCreateUser = useCheckPermission("user", PermissionAction.CREATE);
  const deleteAllMutation = useMutation(
    trpc.loginActivity.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.loginActivity.all.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <div className="flex flex-row gap-2 border-b items-center bg-muted px-4 py-1 text-muted-foreground">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("access_logs")}</Label>
      <div className="ml-auto flex flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/accesslogs?format=pdf&userId=${userId}`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/accesslogs?format=csv&userId=${userId}`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>

            {canCreateUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteAllMutation.mutate({ userId });
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
  );
}
