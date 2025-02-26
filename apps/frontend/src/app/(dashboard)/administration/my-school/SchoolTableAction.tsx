"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function SchoolTableAction({ schoolId }: { schoolId: string }) {
  const { t } = useLocale();
  const router = useRouter();

  const confirm = useConfirm();
  const utils = api.useUtils();

  const deleteSchoolMutation = api.school.delete.useMutation({
    onSettled: () => utils.school.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            router.push("/administration/my-school/" + schoolId + "/edit");
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-4 w-4 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-1",
              },
            });
            if (isConfirmed) {
              toast.loading("deleting", { id: 0 });
              deleteSchoolMutation.mutate(schoolId);
            }
          }}
          variant="destructive"
          className="dark:data-[variant=destructive]:focus:bg-destructive/10"
        >
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
