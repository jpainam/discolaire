"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
const feedbackSchema = z.object({
  content: z.string().min(5),
});

export function FeedBackDialog() {
  const form = useForm<z.infer<typeof feedbackSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(feedbackSchema),
  });
  const { closeModal } = useModal();
  const [isLoading, setIsLoading] = React.useState(false);
  const onSubmit = (feedback: z.infer<typeof feedbackSchema>) => {
    setIsLoading(true);
    fetch("/api/emails/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: feedback.content }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Feedback sent");
          closeModal();
        } else {
          toast.error("An error occured");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.error(e);
        toast.error("An error occured");
      });
  };

  const { t } = useLocale();
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
          <Button isLoading={isLoading} size={"sm"} type="submit">
            {t("send_feedback")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
