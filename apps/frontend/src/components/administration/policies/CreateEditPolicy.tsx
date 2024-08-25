"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { JsonEditor } from "json-edit-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "~/hooks/use-locale";
import { useModal } from "~/hooks/use-modal";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const createEditPolicySchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  description: z.string().optional(),
});
export function CreateEditPolicy() {
  const { t } = useLocale();
  const { closeModal } = useModal();
  const form = useForm<z.infer<typeof createEditPolicySchema>>({
    resolver: zodResolver(createEditPolicySchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });
  const createPolicyMutation = api.policy.create.useMutation();
  const utils = api.useUtils();
  const onSubmit = async (data: z.infer<typeof createEditPolicySchema>) => {
    // TODO parse the content
    const values = {
      name: data.name,
      content: data.content,
      description: data.description || "",
      effect: "Allow" as const,
      actions: ["*"],
      resources: ["*"],
      condition: {},
    };
    toast.promise(createPolicyMutation.mutateAsync(values), {
      loading: t("creating_policy"),
      success: async () => {
        await utils.policy.invalidate();
        return t("policy_created");
      },
      error: (error) => {
        return getErrorMessage(error);
      },
    });
  };
  const jsonData = {
    effect: "Allow",
    actions: ["*"],
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-0"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <JsonEditor data={jsonData} />
        <FormField
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("policy")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-2 flex flex-row justify-end gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
