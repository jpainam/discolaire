"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useLocale } from "~/i18n";
//import { PasswordInput } from "@repo/ui/components/password-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "~/auth/client";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirect: z.string().optional(),
});
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = React.useState(false);

  const redirect = searchParams.get("redirect");
  const { t } = useLocale();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      redirect: redirect ?? "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setIsPending(true);
    const result = await authClient.signIn.username(
      {
        username: data.username,
        password: data.password,
      },
      {
        onError: (ctx) => {
          // Handle the error
          if (ctx.error.status === 403) {
            alert("Please verify your email address");
          }
          //you can also show the original error message
          alert(ctx.error.message);
        },
      },
    );
    if (result.error) {
      // Handle the error
      console.error("Sign in error:", result.error);
      toast.error(result.error.message);
      return;
    }
    console.log("Signed in successfully", result);
    toast.success(t("signed_in_successfully"));
    await fetch("/api/cookies/schoolyear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsPending(false);
    router.push(data.redirect ?? "/");
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <input type="hidden" name="redirect" value={redirect ?? ""} />
          <div className="grid gap-2">
            <div className={className}>
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
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
