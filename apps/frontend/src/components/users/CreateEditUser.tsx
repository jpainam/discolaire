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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTRPC } from "~/trpc/react";

const createEditUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().optional(),
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
      email: "",
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    })
  );
  const updateUserMutation = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    })
  );

  const handleSubmit = (data: z.infer<typeof createEditUserSchema>) => {
    if (userId) {
      toast.loading(t("updating"), { id: 0 });
      updateUserMutation.mutate({
        id: userId,
        username: data.username,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createUserMutation.mutate({
        username: data.username,
        entityId: entityId,
        password: data.password,
        profile: type,
        email: data.email,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel> {t("email")}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
              <FormLabel> {t("password")}</FormLabel>
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
