"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
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

import { authClient, useSession } from "~/auth/client";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

const passwordFormSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

// Only user can reinitialize their own password. For staff to reinitialize user, use the CreateEditUser component.
export function ReinitializePassword() {
  const params = useParams<{ id: string }>();
  const { data: session, isPending } = useSession();
  const disabled = isPending ? true : session?.user.id !== params.id;
  const form = useForm({
    resolver: standardSchemaResolver(passwordFormSchema),
    disabled,
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    toast.loading(t("updating"), { id: 0 });
    if (session?.user.id === params.id) {
      const { error } = await authClient.changePassword({
        newPassword: values.newPassword,
        currentPassword: values.oldPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error.message, { id: 0 });
        return;
      }
      router.push("/auth/login");
    } else {
      toast.error(t("Not authorized"), { id: 0 });
    }
  }
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("reinitializeUserPassword")}
          </CardTitle>
          <CardDescription>
            {t("reinitializeUserPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="oldPassword">
                      {t("oldPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        id="oldPassword"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground flex justify-end text-sm">
                      <Link
                        target="_blank"
                        className="underline"
                        href={routes.auth.forgotPassword}
                      >
                        {t("Forgot password")}
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword">
                      {t("newPassword")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        type="password"
                        disabled={disabled}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size={"sm"} type="submit">
                {t("submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
