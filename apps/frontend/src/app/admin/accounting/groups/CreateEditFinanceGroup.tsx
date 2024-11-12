"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
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
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const createFinanceGroupSchema = z.object({
  name: z.string(),
  type: z.enum(["AMOUNT", "PERCENT"]).default("AMOUNT"),
  value: z.coerce.number().min(1),
});
export function CreateEditFinanceGroup({
  id,
  name,
  type,
  value,
}: {
  id?: string;
  name?: string;
  type?: "AMOUNT" | "PERCENT" | undefined;
  value?: number;
}) {
  const form = useForm({
    schema: createFinanceGroupSchema,
    defaultValues: {
      name: name ?? "",
      type: type ?? ("AMOUNT" as const),
      value: value ?? 1,
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const createFinanceGroup = api.accounting.createGroup.useMutation({
    onSettled: () => utils.accounting.groups.invalidate(),
    onSuccess: () => {
      toast.success("created_successfully", { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const updateFinanceGroup = api.accounting.updateGroup.useMutation({
    onSettled: () => utils.accounting.groups.invalidate(),
    onSuccess: () => {
      toast.success("updated_successfully", { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createFinanceGroupSchema>) => {
    const values = {
      name: data.name,
      type: data.type,
      value: data.value,
    };
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateFinanceGroup.mutate({
        id,
        ...values,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createFinanceGroup.mutate(values);
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
        <div className="grid grid-cols-2 items-center gap-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("type")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="AMOUNT" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t("amount")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="PERCENT" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t("percent")}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-0">
                {/* <FormLabel>{t("value")}</FormLabel> */}
                <FormControl>
                  <Input placeholder="value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              createFinanceGroup.isPending || updateFinanceGroup.isPending
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
