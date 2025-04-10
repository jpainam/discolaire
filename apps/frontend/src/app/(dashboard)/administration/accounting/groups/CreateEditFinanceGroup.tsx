"use client";

import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTRPC } from "~/trpc/react";

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
    resolver: zodResolver(createFinanceGroupSchema),
    defaultValues: {
      name: name ?? "",
      type: type ?? ("AMOUNT" as const),
      value: value ?? 1,
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createFinanceGroup = useMutation(
    trpc.accounting.createGroup.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accounting.groups.pathFilter()
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const updateFinanceGroup = useMutation(
    trpc.accounting.updateGroup.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accounting.groups.pathFilter()
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
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
