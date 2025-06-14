"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authClient } from "~/auth/client";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

const passwordFormSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export function ReinitializePassword() {
  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    toast.loading(t("updating"), { id: 0 });
    const { error } = await authClient.changePassword({
      newPassword: values.newPassword,
      currentPassword: values.oldPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error(error.message, { id: 0 });
      return;
    }
    toast.success(t("updated_successfully"), { id: 0 });
    await queryClient.invalidateQueries(trpc.user.pathFilter());

    router.push("/auth/login");
  }
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("reinitializeUserPassword")}
          </CardTitle>
          <CardDescription>
            {t("reinitializeUserPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="oldPassword">
                      {t("oldPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="oldPassword"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex justify-end text-sm text-muted-foreground">
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
                    <FormLabel htmlFor="newPassword">
                      {t("newPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        type="password"
                        required
                        {...field}
                      />
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
        </CardContent>
      </Card>
    </div>
  );
}
