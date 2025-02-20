import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useConfirm } from "@repo/ui/components/confirm-dialog";
import { Input } from "@repo/ui/components/input";

import type { AppreciationCategory } from "~/types/appreciation";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function CreateEditAppreciationCategory({
  category,
  onCompleted,
}: {
  category?: AppreciationCategory;
  onCompleted?: () => void;
}) {
  const [value, setValue] = useState(category?.name);
  const confirm = useConfirm();
  const deleteAppreciationCategory =
    api.appreciation.deleteCategory.useMutation();
  const updateAppreciationCategory =
    api.appreciation.updateCategory.useMutation();
  const createAppreciationCategory =
    api.appreciation.createCategory.useMutation();
  const utils = api.useUtils();
  const { t } = useLocale();
  return (
    <div className="mb-4 flex flex-col px-1">
      <div className="ml-auto pb-1">
        {category && (
          <XIcon
            onClick={() => onCompleted && onCompleted()}
            className="h-4 w-4 cursor-pointer hover:text-muted-foreground"
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
          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
          <span
            className="cursor-pointer text-xs hover:text-destructive hover:underline"
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
                toast.promise(
                  deleteAppreciationCategory.mutateAsync(category.id),
                  {
                    loading: t("deleting"),
                    success: async () => {
                      await utils.appreciation.categories.invalidate();
                      onCompleted?.();
                      return t("deleted");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              }
            }}
          >
            {category ? t("delete") : t("cancel")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-700" />
          <span
            className="cursor-pointer text-xs hover:text-muted-foreground hover:underline"
            onClick={() => {
              if (category) {
                toast.promise(
                  updateAppreciationCategory.mutateAsync({
                    id: category.id,
                    name: value ?? "N/A",
                  }),
                  {
                    loading: t("updating"),
                    success: () => {
                      void utils.appreciation.categories.invalidate();
                      onCompleted?.();
                      return t("updated");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              } else {
                toast.promise(
                  createAppreciationCategory.mutateAsync({
                    name: value ?? "N/A",
                  }),
                  {
                    loading: t("adding"),
                    success: async () => {
                      await utils.appreciation.categories.invalidate();
                      onCompleted?.();
                      return t("created");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
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
