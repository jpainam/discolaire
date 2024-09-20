"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
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
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";

const changePassword = z.object({
  password: z.string().min(1),
});
export function ChangePassword({ userId }: { userId: string }) {
  const form = useForm({
    schema: changePassword,
    defaultValues: {
      password: "",
    },
  });
  const utils = api.useUtils();
  const userQuery = api.user.get.useQuery(userId);
  const updateUserPasswordMutation = api.user.updatePassword.useMutation({
    onSuccess() {
      toast.success(t("updated_sucessfully"), { id: 0 });
      closeModal();
    },
    onSettled: async () => {
      await utils.user.invalidate();
    },
    onError(err) {
      toast.error(err.message, { id: 0 });
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const onSubmit = (data: z.infer<typeof changePassword>) => {
    toast.loading(t("updating"), { id: 0 });
    updateUserPasswordMutation.mutate({
      userId: userId,
      password: data.password,
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {userQuery.isPending ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <Input disabled value={userQuery.data?.username} />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("new_password")}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            variant={"secondary"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={updateUserPasswordMutation.isPending}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
