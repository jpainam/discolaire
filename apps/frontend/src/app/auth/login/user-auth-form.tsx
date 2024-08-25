"use client";

import * as React from "react";
import { Icons } from "@/components/icons";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { validateAuth } from "@/server/validateAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const authFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
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
      res?.error && toast.error(res.error);
    } else {
      validateAuth(); // TODO FIX THIS
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
          signIn("google", { callbackUrl: "/" });
        }}
        disabled={isLoading}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
