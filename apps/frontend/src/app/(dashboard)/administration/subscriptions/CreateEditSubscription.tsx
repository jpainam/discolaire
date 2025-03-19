"use client";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
import { z } from "zod";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
const formSchema = z.object({
  userId: z.string().min(1),
  emails: z.number().default(0),
  unlimitedEmails: z.boolean().default(false),
  sms: z.number().default(0),
  unlimitedSms: z.boolean().default(false),
  whatsapp: z.number().default(0),
  unlimitedWhatsapp: z.boolean().default(false),
});
export function CreateEditSubscription() {
  const form = useForm({
    schema: formSchema,
    defaultValues: {},
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  const { t } = useLocale();
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{t("user")}</FormLabel>
                <FormControl>
                  <UserSelector {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_emails")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_emails")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedEmails"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_emails")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="sms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_sms")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_sms")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedSms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_sms")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_whatsapp_messages")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_whatsapp_messages")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedWhatsapp"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_whatsapp_messages")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end items-center gap-4">
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" size={"sm"}>
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
