"use client";

import * as React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/hooks/use-locale";
import { useRouter } from "@repo/hooks/use-router";
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

import { Icons } from "~/components/icons";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const authFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const form = useForm({
    schema: authFormSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof authFormSchema>) {
    setIsLoading(true);
    const res = await signIn("credentials", {
      username: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }
  const { t } = useLocale("auth");
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem className={className}>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      autoCorrect="off"
                      autoComplete="email"
                      type="email"
                      required
                      autoCapitalize="none"
                      placeholder={"m@example.com"}
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
          </div>
        </form>
      </Form>
      <div className="relative">
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
      </Button>
    </div>
  );
}
