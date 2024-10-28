"use client";

import * as React from "react";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

import { cn } from "~/lib/utils";
import { authenticate } from "./signin";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [state, submitAction, isPending] = React.useActionState(authenticate, {
    error: "",
  });

  const { t } = useLocale();
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form action={submitAction}>
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
            <Input
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
