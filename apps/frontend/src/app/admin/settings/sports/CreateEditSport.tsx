"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { api } from "~/trpc/react";

const createSportSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditSport({ id, name }: { id?: string; name?: string }) {
  const form = useForm({
    schema: createSportSchema,
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const createSportMutation = api.setting.createSport.useMutation({
    onSettled: () => utils.setting.sports.invalidate(),
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const updateSportMutation = api.setting.updateSport.useMutation({
    onSettled: () => utils.setting.sports.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createSportSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateSportMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createSportMutation.mutate({ name: data.name });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center justify-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createSportMutation.isPending || updateSportMutation.isPending
            }
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
