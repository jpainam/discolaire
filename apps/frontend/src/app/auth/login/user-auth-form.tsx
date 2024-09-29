"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { signIn } from "~/actions/signin";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const authFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const form = useForm({
    schema: authFormSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authFormSchema>) {
    setIsLoading(true);
    try {
      await signIn({
        username: data.username,
        password: data.password,
        redirectTo: searchParams.get("redirect") ?? undefined,
      });
    } catch (e) {
      console.error(e);
      toast.error("Invalid credentials");
    }
    setIsLoading(false);
  }
  const { t } = useLocale();
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name={"username"}
              render={({ field }) => (
                <FormItem className={className}>
                  <FormLabel>{t("username")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      autoCorrect="off"
                      required
                      autoComplete="current-password"
                      autoCapitalize="none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem className={className}>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      current-password="true"
                      disabled={isLoading}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
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
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or_continue_with")}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          void signIn("google");
        }}
        disabled={isLoading}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button> */}
    </div>
  );
}
