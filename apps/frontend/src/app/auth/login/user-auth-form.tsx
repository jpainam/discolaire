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
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useLocale } from "~/i18n";
//import { PasswordInput } from "@repo/ui/components/password-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signIn } from "~/actions/signin";
import { authClient } from "~/auth/client";
import { cn } from "~/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirect: z.string().optional(),
});
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [state, _submitAction, isPending] = React.useActionState(signIn, {
    error: "",
  });
  const searchParams = useSearchParams();
  // React.useEffect(() => {
  //   const f = async () => {
  //     const d = await authClient.signUp.email({
  //       email: "jpainam@gmail.com",
  //       name: "Jean P.Ainam",
  //       password: "admin1234",
  //       username: "admin",
  //       profile: "staff",
  //       schoolId: "cm1hbntgn00001h578bvyjxln",
  //     });
  //     console.log("Sign up result:", d);
  //   };
  //   void f();
  // }, []);

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
      }
    );
    if (result.error) {
      // Handle the error
      console.error("Sign in error:", result.error);
      toast.error(result.error.message);
      return;
    }
    console.log("Signed in successfully", result);
    toast.success(t("signed_in_successfully"));
  };

  const handleSubmit2 = async () => {
    toast.info("Signing up...");
    const data = await authClient.signUp.email({
      email: "jpainam@gmail.com",
      name: "Jean P.Ainam",
      password: "admin1234",
      username: "admin",
      profile: "staff",
      schoolId: "cm1hbntgn00001h578bvyjxln",
    });
    console.log("Sign up result:", data);
    toast.success(t("signed_up_successfully"));
    if (data.error) {
      console.error("Sign up error:", data.error);
      toast.error(data.error.message);
      return;
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit2)}>
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

            {state.error && (
              <div className="text-sm text-red-500">{t(state.error)}</div>
            )}
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
