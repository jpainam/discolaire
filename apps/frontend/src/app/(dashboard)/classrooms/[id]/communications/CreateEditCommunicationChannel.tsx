"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@repo/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["whatsapp", "sms", "email", "telegram", "other"]),
  url: z.string().url(),
});
export function CreateEditCommunicationChannel({
  channel,
}: {
  channel: RouterOutputs["communicationChannel"]["all"][number];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };
  const { t } = useLocale();
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="gap-6">
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              size={"sm"}
              type="button"
              variant="outline"
              onClick={() => closeModal()}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" size={"sm"}>
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
