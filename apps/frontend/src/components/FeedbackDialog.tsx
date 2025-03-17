"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { resend } from "@repo/notification";
import { FeedbackEmail } from "@repo/transactional/emails/FeedbackEmail";
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
import { useSession } from "~/providers/AuthProvider";
import { useSchool } from "~/providers/SchoolProvider";
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
  const { user } = useSession();
  const { school } = useSchool();
  const [isLoading, setIsLoading] = React.useState(false);
  const onSubmit = async (feedback: z.infer<typeof feedbackSchema>) => {
    setIsLoading(true);
    const { data, error } = await resend.emails.send({
      from: "Feedback <no-reply@discolaire.com>",
      to: ["jpainam@gmail.com"],
      subject: "Feedback",
      react: FeedbackEmail({
        message: feedback.content,
        usernameSender: user?.username,
        emailSender: user?.email ?? "",
        userId: user?.id,
        school: { name: school.name, id: school.id },
      }) as React.ReactElement,
    });

    if (error) {
      console.error(error);
      toast.error(error.message);
    } else {
      toast.success("Feedback sent");
      console.log(data);
    }
    setIsLoading(false);
    closeModal();
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
          <Button isLoading={isLoading} size={"sm"} type="submit">
            {t("send_feedback")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
