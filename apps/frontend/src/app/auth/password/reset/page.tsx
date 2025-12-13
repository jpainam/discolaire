"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "~/auth/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/hooks/use-router";

const formSchema = z.object({
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <div className="text-red-600">Invalid token</div>;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      return null;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
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
    setIsLoading(false);
    setIsSuccess(true);
    toast.success("Password reset successful");
    router.push("/auth/login");
  }

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("reset_password")}</CardTitle>
          <CardDescription>{t("enter_your_new_password")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert>
              <KeyRound className="h-4 w-4" />

              <AlertTitle>{t("password_reset_successful")}</AlertTitle>
              <AlertDescription>
                {t("password_reset_successful_description")}
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("new_password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("enter_your_new_password")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirm_new_password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("confirm_your_new_password")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("resetting") : t("reset_password")}
                </Button>
              </form>
            </Form>
          )}
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
