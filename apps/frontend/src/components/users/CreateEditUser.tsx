import { toast } from "sonner";
import { z } from "zod";

import type { Option } from "~/components/students/multiple-selector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { Button } from "@repo/ui/components/button";
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
import MultipleSelector from "~/components/students/multiple-selector";

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const createEditUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  roleId: z.array(z.string().min(1)),
});

export function CreateEditUser({
  entityId,
  userId,
  username,
  type,
  roleIds,
}: {
  entityId: string;
  userId?: string;
  username?: string;
  roleIds?: string[];
  type: "staff" | "contact" | "student";
}) {
  const form = useForm({
    schema: createEditUserSchema,
    defaultValues: {
      username: username ?? "",
      password: "",
      roleId: roleIds ?? [],
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const attachUserMutation = api.user.attachUser.useMutation({
    onSuccess: () => {
      toast.success(t("attached_successfully"), { id: 0 });
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
  });

  const createUserMutation = api.user.create.useMutation({
    onSuccess: (user) => {
      toast.loading(t("attaching_user"), { id: 0 });
      attachUserMutation.mutate({
        userId: user.id,
        entityId: entityId,
        type: type,
      });
      router.refresh();
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
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

  const rolesQuery = api.role.all.useQuery();
  const roleOptions: Option<string>[] = rolesQuery.data
    ? rolesQuery.data.map((role) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  const handleSubmit = (data: z.infer<typeof createEditUserSchema>) => {
    if (userId) {
      toast.loading(t("updating"), { id: 0 });
      updateUserMutation.mutate({
        id: userId,
        username: data.username,
        password: data.password,
        roleId: data.roleId,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createUserMutation.mutate({
        username: data.username,
        password: data.password,
        roleId: data.roleId,
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
