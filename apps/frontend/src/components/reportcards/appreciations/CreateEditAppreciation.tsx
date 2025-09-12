import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Textarea } from "@repo/ui/components/textarea";

import type { Appreciation, AppreciationCategory } from "~/types/appreciation";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function CreateEditAppreciation({
  category,
  onCompleted,
  appreciation,
}: {
  category?: AppreciationCategory;
  appreciation?: RouterOutputs["appreciation"]["all"][number] | Appreciation;
  onCompleted?: () => void;
}) {
  const [value, setValue] = useState(category?.name);
  const confirm = useConfirm();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteAppreciationMutation = useMutation(
    trpc.appreciation.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.appreciation.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const createAppreciationMutation = useMutation(
    trpc.appreciation.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.appreciation.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateAppreciationMutation = useMutation(
    trpc.appreciation.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.appreciation.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="mb-4 flex w-full flex-col px-1">
      <div className="ml-auto pb-1">
        <XIcon
          onClick={() => onCompleted?.()}
          className="hover:text-muted-foreground h-4 w-4 cursor-pointer"
        />
      </div>
      <Textarea
        onChange={(e) => setValue(e.target.value)}
        defaultValue={appreciation?.content}
        className="h-8"
      />

      <div className="mt-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-destructive h-1.5 w-1.5 rounded-full" />
          <span
            className="hover:text-destructive cursor-pointer text-xs hover:underline"
            onClick={async () => {
              if (!category || !appreciation) {
                return;
              }
              const isConfirmed = await confirm({
                title: t("delete"),
                confirmText: t("delete"),
                cancelText: t("cancel"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.loading(t("deleting"), { id: 0 });
                deleteAppreciationMutation.mutate(appreciation.id);
              }
            }}
          >
            {appreciation ? t("delete") : t("cancel")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-700" />
          <span
            className="hover:text-muted-foreground cursor-pointer text-xs hover:underline"
            onClick={() => {
              if (category && appreciation) {
                if (!value) {
                  toast.error(t("required"));
                  return;
                }
                toast.loading(t("updating"), { id: 0 });
                updateAppreciationMutation.mutate({
                  content: value,
                  id: appreciation.id,
                  categoryId: category.id,
                });
              } else {
                if (!value) {
                  toast.error(t("required"));
                  return;
                }
                if (!category) {
                  toast.error(t("required"));
                  return;
                }
                toast.loading(t("creating"), { id: 0 });
                createAppreciationMutation.mutate({
                  content: value,
                  categoryId: category.id,
                });
              }
            }}
          >
            {appreciation ? t("edit") : t("add")}
          </span>
        </div>
      </div>
    </div>
  );
}
