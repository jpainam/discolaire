"use client";

import Link from "next/link";
import { routes } from "@/configs/routes";
import { useLocale } from "@/hooks/use-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordFormSchema = z.object({
  oldPassword: z.string().min(6, {}),
  newPassword: z.string().min(6, {}),
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<PasswordFormValues> = {
  oldPassword: "",
  newPassword: "",
};

export function ReinitializePasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: PasswordFormValues) {
    console.log(data);
  }
  const { t } = useLocale();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="oldPassword">{t("oldPassword")}</FormLabel>
              <FormControl>
                <Input id="oldPassword" type="password" required {...field} />
              </FormControl>
              <FormDescription className="flex justify-end">
                <Link
                  target="_blank"
                  className="underline"
                  href={routes.auth.forgotPassword}
                >
                  {t("forgotPassword")}
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="newPassword">{t("newPassword")}</FormLabel>
              <FormControl>
                <Input id="newPassword" type="password" required {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size={"sm"} type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
