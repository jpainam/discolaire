"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Policy } from "@repo/db";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

const createEditPolicySchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  description: z.string().optional(),
});
const parsedContentSchema = z.object({
  effect: z.enum(["Allow", "Deny"]),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  condition: z.any().optional(),
});
export function CreateEditPolicy({ policy }: { policy?: Policy }) {
  const { t } = useLocale();
  const { closeModal } = useModal();
  const form = useForm<z.infer<typeof createEditPolicySchema>>({
    resolver: zodResolver(createEditPolicySchema),
    defaultValues: {
      name: policy?.name ?? "",
      description: policy?.description ?? "",
      content: JSON.stringify({
        effect: policy?.effect ?? "Allow",
        resources: policy?.resources ?? ["*"],
        actions: policy?.actions ?? ["write:*", "read:*"],
        conditions: policy?.condition ?? {},
      }),
    },
  });
  const utils = api.useUtils();
  const updatePolicyMutation = api.policy.update.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onSuccess: () => {
      closeModal();
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createPolicyMutation = api.policy.create.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onSuccess: () => {
      closeModal();
      toast.success(t("created_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const onSubmit = (data: z.infer<typeof createEditPolicySchema>) => {
    const content = JSON.parse(data.content);
    const parsed = parsedContentSchema.safeParse(content);
    if (!parsed.success) {
      toast.error(t("invalid_policy"), { id: 0 });
      return;
    }
    const parsedContent = parsed.data;
    const values = {
      name: data.name,
      content: data.content,
      description: data.description ?? "",
      effect: parsedContent.effect,
      actions: parsedContent.actions,
      resources: parsedContent.resources,
      condition: parsedContent.condition,
    };
    if (policy) {
      toast.loading(t("updating"), { id: 0 });
      updatePolicyMutation.mutate({ id: policy.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createPolicyMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("policy")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} />
                {/* <PolicyEditor
                  defaultValue={field.value}
                  onChange={field.onChange}
                /> */}
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-row justify-end gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
