import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Textarea } from "@repo/ui/textarea";

import { useAlert } from "~/hooks/use-alert";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { Appreciation, AppreciationCategory } from "~/types/appreciation";

export function CreateEditAppreciation({
  category,
  onCompleted,
  appreciation,
}: {
  category?: AppreciationCategory;
  appreciation?: Appreciation;
  onCompleted?: () => void;
}) {
  const [value, setValue] = useState(category?.name);
  const { openAlert, closeAlert } = useAlert();
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteAppreciationMutation = api.appreciation.delete.useMutation();
  const createAppreciationMutation = api.appreciation.create.useMutation();
  const updateAppreciationMutation = api.appreciation.update.useMutation();
  const router = useRouter();
  return (
    <div className="mb-4 flex w-full flex-col px-1">
      <div className="ml-auto pb-1">
        <XIcon
          onClick={() => onCompleted?.()}
          className="h-4 w-4 cursor-pointer hover:text-muted-foreground"
        />
      </div>
      <Textarea
        onChange={(e) => setValue(e.target.value)}
        defaultValue={appreciation?.content}
        className="h-8"
      />

      <div className="mt-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
          <span
            className="cursor-pointer text-xs hover:text-destructive hover:underline"
            onClick={() => {
              if (category && appreciation) {
                openAlert({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  onConfirm: () => {
                    toast.promise(
                      deleteAppreciationMutation.mutateAsync(appreciation.id),
                      {
                        loading: t("deleting"),
                        success: async () => {
                          await utils.appreciation.invalidate();
                          closeAlert();
                          onCompleted?.();
                          return t("deleted");
                        },
                        error: (error) => {
                          closeAlert();
                          return getErrorMessage(error);
                        },
                      },
                    );
                  },
                  onCancel: () => {
                    closeAlert();
                  },
                });
              } else {
                onCompleted?.();
              }
            }}
          >
            {appreciation ? t("delete") : t("cancel")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-700" />
          <span
            className="cursor-pointer text-xs hover:text-muted-foreground hover:underline"
            onClick={() => {
              if (category && appreciation) {
                if (!value) {
                  toast.error(t("required"));
                  return;
                }
                toast.promise(
                  updateAppreciationMutation.mutateAsync({
                    content: value,
                    id: appreciation.id,
                    categoryId: category.id,
                  }),
                  {
                    loading: t("updating"),
                    success: async () => {
                      await utils.appreciation.invalidate();
                      onCompleted?.();
                      return t("updated");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              } else {
                if (!value) {
                  toast.error(t("required"));
                  return;
                }
                if (!category) {
                  toast.error(t("required"));
                  return;
                }
                toast.promise(
                  createAppreciationMutation.mutateAsync({
                    content: value,
                    categoryId: category.id,
                  }),
                  {
                    loading: t("adding"),
                    success: async () => {
                      await utils.appreciation.invalidate();
                      onCompleted?.();
                      return t("added");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
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
