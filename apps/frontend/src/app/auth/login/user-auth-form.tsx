"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { PasswordInput } from "@repo/ui/password-input";

import { signIn } from "~/actions/signin";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [state, submitAction, isPending] = React.useActionState(signIn, {
    error: "",
  });
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { t } = useLocale();

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={submitAction}>
        <input type="hidden" name="redirect" value={redirect ?? ""} />
        <div className="grid gap-2">
          <div className={className}>
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              autoCorrect="off"
              required
              id="username"
              autoCapitalize="none"
              name="username"
            />
          </div>

          <div className={className}>
            <Label htmlFor="password">{t("password")}</Label>

            <PasswordInput
              required
              current-password="true"
              type="password"
              id="password"
              name="password"
            />
          </div>

          {state.error && (
            <div className="text-sm text-red-500">{t(state.error)}</div>
          )}
          <Button disabled={isPending}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
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
    </div>
  );
}
