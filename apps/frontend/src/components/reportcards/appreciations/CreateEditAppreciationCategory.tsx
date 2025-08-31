import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@repo/ui/components/input";

import type { AppreciationCategory } from "~/types/appreciation";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function CreateEditAppreciationCategory({
  category,
  onCompleted,
}: {
  category?: AppreciationCategory;
  onCompleted?: () => void;
}) {
  const [value, setValue] = useState(category?.name);
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteAppreciationCategory = useMutation(
    trpc.appreciation.deleteCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.appreciation.categories.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateAppreciationCategory = useMutation(
    trpc.appreciation.updateCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.appreciation.categories.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const createAppreciationCategory = useMutation(
    trpc.appreciation.createCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.appreciation.categories.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { t } = useLocale();
  return (
    <div className="mb-4 flex flex-col px-1">
      <div className="ml-auto pb-1">
        {category && (
          <XIcon
            onClick={() => onCompleted?.()}
            className="hover:text-muted-foreground h-4 w-4 cursor-pointer"
          />
        )}
      </div>
      <Input
        onChange={(e) => setValue(e.target.value)}
        defaultValue={category?.name}
        className="h-8"
      />

      <div className="mt-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-destructive h-1.5 w-1.5 rounded-full" />
          <span
            className="hover:text-destructive cursor-pointer text-xs hover:underline"
            onClick={async () => {
              if (!category) {
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
                deleteAppreciationCategory.mutate(category.id);
              }
            }}
          >
            {category ? t("delete") : t("cancel")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-700" />
          <span
            className="hover:text-muted-foreground cursor-pointer text-xs hover:underline"
            onClick={() => {
              if (category) {
                toast.loading(t("updating"), { id: 0 });
                updateAppreciationCategory.mutate({
                  id: category.id,
                  name: value ?? "N/A",
                });
              } else {
                toast.loading(t("creating"), { id: 0 });
                createAppreciationCategory.mutate({
                  name: value ?? "N/A",
                });
              }
            }}
          >
            {category ? t("edit") : t("add")}
          </span>
        </div>
      </div>
    </div>
  );
}
