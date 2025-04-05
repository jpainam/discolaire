"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  token: z.string().min(1),
});

export function SignUpForm() {
  const router = useRouter();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const signUpMutation = api.user.signUp.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/auth/login");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      token: searchParams.get("token") ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signUpMutation.mutate(
      {
        username: values.username,
        password: values.password,
        token: values.token,
      },
      {
        onError: (err) => {
          console.error(err);
          toast.error(err.message);
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("create_an_account")}</CardTitle>
          <CardDescription>
            {t("create_an_account_description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        placeholder={t("username")}
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
                        type="password"
                        autoComplete="current-password"
                        placeholder={t("password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("registrationCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("registrationCode")} {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("registration_code_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending
                  ? t("creating")
                  : t("create_an_account")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => router.push("/auth/login")}
          >
            {t("back_to_login")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
