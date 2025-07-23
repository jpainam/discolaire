"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { authClient } from "~/auth/client";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  token: z.string().min(1),
});

export function SignUpForm({
  token,
  userId,
  name,
}: {
  token: string;
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const trpc = useTRPC();
  const signUpMutation = useMutation(
    trpc.user.completeRegistration.mutationOptions({
      onSuccess: () => {
        toast.success(t("created_successfully"));
        setIsLoading(false);
        router.push("/auth/login");
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message);
      },
    }),
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      token: token,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      return null;
    }
    setIsLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token: token,
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    signUpMutation.mutate({
      userId,
      username: values.username,
      password: values.password,
      token: values.token,
    });
  }

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("Configure your account")}</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {t("Please fill in the details of your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-center text-xl font-bold">{name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>{t("new_password")}</FormLabel>
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

              <Button
                type="submit"
                className="w-full"
                isLoading={signUpMutation.isPending || isLoading}
              >
                {t("Register")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-muted-foreground text-sm"
            onClick={() => router.push("/auth/login")}
          >
            {t("back_to_login")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
