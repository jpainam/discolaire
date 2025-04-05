import { toast } from "sonner";
import { z } from "zod";

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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const createEditUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export function CreateEditUser({
  entityId,
  userId,
  username,
  type,
}: {
  entityId: string;
  userId?: string;
  username?: string;
  type: "staff" | "contact" | "student";
}) {
  const form = useForm({
    resolver: zodResolver(createEditUserSchema),
    defaultValues: {
      username: username ?? "",
      password: "",
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const createUserMutation = api.user.create.useMutation({
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
    onSettled: async () => {
      await utils.user.invalidate();
    },
  });
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
    onSettled: async () => {
      await utils.user.invalidate();
    },
  });

  const handleSubmit = (data: z.infer<typeof createEditUserSchema>) => {
    if (userId) {
      toast.loading(t("updating"), { id: 0 });
      updateUserMutation.mutate({
        id: userId,
        username: data.username,
        password: data.password,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createUserMutation.mutate({
        username: data.username,
        password: data.password,
        entityId: entityId,
        profile: type,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username"> {t("username")}</FormLabel>
              <FormControl>
                <Input
                  autoComplete="username"
                  placeholder="username"
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
              <FormLabel htmlFor="username"> {t("password")}</FormLabel>
              <FormControl>
                <Input autoComplete="new-password" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            size={"sm"}
            variant="secondary"
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createUserMutation.isPending || updateUserMutation.isPending
            }
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
