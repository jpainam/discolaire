"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { useRouter } from "~/hooks/use-router";

const formSchema = z.object({
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  registrationCode: z.string().min(1),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      registrationCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    // In a real application, you would call your API here to reset the password
    console.log(values);
  }
  const router = useRouter();
  const { t } = useLocale();

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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("lastName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("firstName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationCode"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>{t("registrationCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("registrationCode")} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("registration_code_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("creating") : t("create_an_account")}
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
