"use client";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  dosage: z.string().min(1),
});
export function CreateEditDrug({
  name,
  description,
  dosage,
  studentId,
}: {
  name?: string;
  description?: string;
  dosage?: string;
  studentId: string;
}) {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      description: "",
      dosage: "",
    },
  });
  const { closeModal } = useModal();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    console.log(studentId, name, description, dosage);
    toast.warning("Not implemented");
  };
  const { t } = useLocale();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dosage")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-6">
            <Button
              onClick={() => {
                closeModal();
              }}
              variant={"outline"}
              type="button"
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("submit")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
