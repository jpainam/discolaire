"use client";

import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["feedback", "request", "question"]),
  content: z.string().min(10),
});

export function FeedBackDialog() {
  const form = useForm<z.infer<typeof feedbackSchema>>({
    defaultValues: {
      type: "feedback",
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
            name={"type"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("feedback_type")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("feedback_type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feedback">{t("feedback")}</SelectItem>
                      <SelectItem value="request">{t("request")}</SelectItem>
                      <SelectItem value="question">{t("question")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"content"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
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
