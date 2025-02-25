"use client";

import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "~/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const passwordFormSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

const defaultValues: Partial<z.infer<typeof passwordFormSchema>> = {
  oldPassword: "",
  newPassword: "",
};

export function ReinitializePasswordForm() {
  const form = useForm({
    schema: passwordFormSchema,
    defaultValues,
    mode: "onChange",
  });
  const utils = api.useUtils();
  const router = useRouter();

  const updateUserPasswordMutation = api.user.updateMyPassword.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push(routes.auth.login);
    },
    onSettled: () => utils.user.invalidate(),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  function onSubmit(data: z.infer<typeof passwordFormSchema>) {
    toast.loading(t("updating"), { id: 0 });
    updateUserPasswordMutation.mutate(data);
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
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
