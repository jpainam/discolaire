"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  requiredSessionCount: z.number().positive().default(0),
});

export function CreateUpdateSubjectProgram({
  program,
}: {
  program?: RouterOutputs["program"]["get"];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: program?.title ?? "",
      description: program?.description ?? "",
      requiredSessionCount: program?.requiredSessionCount ?? 0,
    },
  });
  const { closeModal } = useModal();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const t = useTranslations();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
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
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              closeModal();
            }}
          ></Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
