"use client";
import type { RouterOutputs } from "@repo/api";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "sonner";
import { z } from "zod";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";
const updateUserPasswordSchema = z.object({
  new_password: z.string().min(8),
  confirm_password: z.string().min(8),
});
export function ChangeUserPassword({
  user,
}: {
  user: NonNullable<RouterOutputs["user"]["get"]>;
}) {
  const form = useForm({
    schema: updateUserPasswordSchema,
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });
  const utils = api.useUtils();
  const updateUserPassword = api.user.updatePassword.useMutation({
    onSettled: () => {
      void utils.user.get.invalidate(user.id);
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { t } = useLocale();
  const handleSubmit = (values: z.infer<typeof updateUserPasswordSchema>) => {
    if (values.new_password !== values.confirm_password) {
      toast.error(t("password_mismatch"));
      return;
    }
    toast.success(t("updating"), { id: 0 });
    void updateUserPassword.mutate({
      userId: user.id,
      password: values.new_password,
    });
  };
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("reset_password")}</CardTitle>
          <CardDescription>
            {t("reset_password_description", { user: user.name })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("new_password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirm_password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                isLoading={updateUserPassword.isPending}
                type="submit"
                className="w-fit"
              >
                {t("reset_password")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
