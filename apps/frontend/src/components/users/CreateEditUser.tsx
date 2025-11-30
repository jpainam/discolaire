import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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
import { useTRPC } from "~/trpc/react";

const createEditUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
});

export function CreateEditUser({
  entityId,
  userId,
  username,
  email,
  type,
}: {
  entityId: string;
  userId?: string;
  username?: string;
  email?: string | null;
  type: "staff" | "contact" | "student";
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditUserSchema),
    defaultValues: {
      username: username ?? "",
      password: "",
      email: email ?? "",
    },
  });
  const { closeModal } = useModal();

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.get.pathFilter());
        await queryClient.invalidateQueries(trpc.staff.get.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.get.pathFilter());
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );
  const updateUserMutation = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.get.pathFilter());
        await queryClient.invalidateQueries(trpc.staff.get.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.get.pathFilter());
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof createEditUserSchema>) => {
    if (userId) {
      toast.loading(t("updating"), { id: 0 });
      updateUserMutation.mutate({
        id: userId,
        username: data.username,
        password: data.password,
        email: data.email,
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
        <div className="grid grid-cols-2 gap-x-4">
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
