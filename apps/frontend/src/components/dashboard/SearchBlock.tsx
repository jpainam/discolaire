"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { cn } from "~/lib/utils";

const FormSchema = z.object({
  q: z.string().min(2),
});

export function SearchBlock({ className }: { className?: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      q: "",
    },
  });
  const { t } = useLocale();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex w-full flex-row items-start gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="h-9 w-full"
                  placeholder={t("search_dashboard_placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("supported_entities")} {t("students")}, {t("staffs")},{" "}
                {t("parents")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size={"sm"} type="submit">
          {t("search")}
        </Button>
      </form>
    </Form>
  );
}
