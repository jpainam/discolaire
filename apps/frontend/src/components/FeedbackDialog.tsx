"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

const feedbackSchema = z.object({
  content: z.string().min(10),
});

export function FeedBackDialog() {
  const form = useForm<z.infer<typeof feedbackSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(feedbackSchema),
  });
  const { closeModal } = useModal();
  const onSubmit = (data: z.infer<typeof feedbackSchema>) => {
    console.log(data);
  };
  const { t } = useLocale("description");
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 px-4">
          <FormField
            name={"content"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={100}
                    placeholder={t("help_us_improve_this_page")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <span className="px-4 text-xs">{t("have_a_specific_issue")}</span>

        <div className="flex flex-row justify-end gap-4 px-4">
          <Button
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
            variant={"secondary"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {t("send_feedback")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
