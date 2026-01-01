"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader, Mail } from "lucide-react";
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
  email: z.string().email(),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const t = useTranslations();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/auth/password/reset",
    });
    if (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Une erreur s'est produite");
      return;
    }

    toast.success("Un e-mail de réinitialisation a été envoyé");
    setIsSuccess(true);
  }

  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("Forgot password")}</CardTitle>
          <CardDescription>
            {t("enter_your_email_to_reset_your_password")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert>
              <Mail className="h-4 w-4 text-green-900 dark:text-green-300" />
              <AlertTitle className="font-bold text-green-900 dark:text-green-300">
                {t("check_your_email")}
              </AlertTitle>
              <AlertDescription>
                {t("we_have_sent_you_an_email_with_reset_instructions")}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    t("send_reset_link")
                  )}
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
