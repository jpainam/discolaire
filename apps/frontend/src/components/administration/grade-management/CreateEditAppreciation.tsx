"use client";

import { InputField } from "@/components/shared/forms/input-field";
import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { getErrorMessage } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const appreciationFormSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
});
type AppreciationFormValues = z.infer<typeof appreciationFormSchema>;

export function CreateEditAppreciation() {
  const { closeModal } = useModal();
  const form = useForm<AppreciationFormValues>({
    resolver: zodResolver(appreciationFormSchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });
  const { t } = useLocale();

  const onSubmit = async (data: AppreciationFormValues) => {
    toast.promise(Promise.resolve(), {
      success: () => {
        closeModal();
        return t("not_yet_implemented");
      },
      loading: t("creating_appreciation"),
      error: (error) => {
        console.error(error);
        return getErrorMessage(error);
      },
    });
  };
  return (
    <Form {...form}>
      <form className="text-sm" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <InputField label={t("name")} name="name" />
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("content")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="format: [max value, appreciation value]"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="ml-auto mt-4 flex flex-row gap-4">
            <Button
              onClick={() => {
                closeModal();
              }}
              variant={"outline"}
              type="button"
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
