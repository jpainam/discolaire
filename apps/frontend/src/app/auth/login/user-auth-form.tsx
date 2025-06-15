"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setCookieFromSignIn } from "~/actions/signin";
import { authClient } from "~/auth/client";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const schema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
});
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const { t } = useLocale();
  const [isPending, setIsPending] = React.useState(false);
  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);
    const { data, error } = await authClient.signIn.username({
      username: values.username,
      password: values.password,
      rememberMe: true,
    });
    if (error) {
      toast.error(error.message, { id: 0 });
      setIsPending(false);
    }
    if (!data) {
      toast.error(t("invalid_credentials"), { id: 0 });
      setIsPending(false);
      return;
    }
    const user = data.user;

    const result = await setCookieFromSignIn({
      userId: user.id,
    });
    if (result.error) {
      toast.error(result.error, { id: 0 });
      setIsPending(false);
      return;
    }
    router.push(redirect ?? "/");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    placeholder="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    autoCorrect="off"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    type="password"
                    placeholder="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <Button disabled={isPending}>
              {isPending && <ReloadIcon className="h-4 w-4 animate-spin" />}
              {t("signin_with_email")}
            </Button>
            <Link
              href="/auth/password/forgot"
              className="ml-auto text-sm text-primary hover:underline"
            >
              {t("forgot_password")}?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
