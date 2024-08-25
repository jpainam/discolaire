import { useTransition } from "react";
import { Mail } from "@/app/(dashboard)/mail/data";
import { DeletePopover } from "@/components/shared/buttons/delete-popover";
import { useLocale } from "@/hooks/use-locale";
import { getErrorMessage } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { Fee } from "@prisma/client";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Separator } from "@repo/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";
import { CopyPlus, Forward, MoreVertical, Reply } from "lucide-react";
import { toast } from "sonner";

import { FeesDetailsForm } from "./fees-details-form";

interface MailDisplayProps {
  mail: Mail | null;
}

export default function FeesDetails({ fee }: { fee?: Fee }) {
  const today = new Date();

  const { t } = useLocale();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const feeMutation = api.fee.delete.useMutation();
  const utils = api.useUtils();
  const onDeleteFee = async (id: number) => {
    toast.promise(feeMutation.mutateAsync({ id }), {
      loading: t("deleting"),
      success: async (data) => {
        utils.fee.all.invalidate();
        return t("deleted_successfully");
      },
      error: (err) => getErrorMessage(err),
    });
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!fee}>
                <CopyPlus className="h-4 w-4" />
                <span className="sr-only">{t("duplicate")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("duplicate")}</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <DeletePopover
                title={t("delete")}
                className="border-none"
                disabled={!fee || isDeletePending}
                description={t("delete_confirmation")}
                onDelete={() => {
                  fee && startDeleteTransition(() => onDeleteFee(fee.id));
                }}
              />
            </TooltipTrigger>
            <TooltipContent>{t("delete")}</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!fee}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!fee}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!fee}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("plus")}</DropdownMenuItem>
            {/*<DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {fee ? (
        <FeesDetailsForm />
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          {t("no_selection")}
        </div>
      )}
    </div>
  );
}
