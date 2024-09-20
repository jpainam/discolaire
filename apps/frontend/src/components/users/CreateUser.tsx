import { toast } from "sonner";
import { z } from "zod";

import type { Option } from "@repo/ui/multiple-selector";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
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
import MultipleSelector from "@repo/ui/multiple-selector";

import { api } from "~/trpc/react";

const createUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  roleId: z.array(z.string().min(1)),
});

export function CreateUser({
  onSuccess,
}: {
  onSuccess: (userId: string) => void;
}) {
  const form = useForm({
    schema: createUserSchema,
    defaultValues: {
      username: "",
      password: "",
      roleId: [],
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const createUserMutation = api.user.create.useMutation({
    onSuccess: (user) => {
      onSuccess(user.id);
      router.refresh();
      toast.success(t("created_sucessfully"), { id: 0 });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
    onSettled: async () => {
      await utils.user.invalidate();
    },
  });

  const rolesQuery = api.role.all.useQuery();
  const roleOptions: Option<string>[] = rolesQuery.data
    ? rolesQuery.data.map((role) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  const handleSubmit = (data: z.infer<typeof createUserSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createUserMutation.mutate({
      username: data.username,
      password: data.password,
      roleId: data.roleId,
    });
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
                <Input placeholder="username" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("roles")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  // @ts-expect-error TODO: fix this
                  defaultOptions={form.getValues("roleId")}
                  options={roleOptions}
                  hidePlaceholderWhenSelected
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button isLoading={createUserMutation.isPending} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
