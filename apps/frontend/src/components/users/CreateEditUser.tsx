import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { Spinner } from "../ui/spinner";

const createUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.union([z.string().email(), z.literal(""), z.null()]),
});
const editUserSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
  email: z.union([z.string().email(), z.literal(""), z.null()]),
});
type CreateEditUserFormValues = z.input<typeof createUserSchema>;

export function CreateEditUser({
  entityId,
  userId,
  username,
  email,
  type,
}: {
  entityId?: string;
  userId?: string;
  username?: string;
  email?: string | null;
  type: "staff" | "contact" | "student";
}) {
  const schema = userId ? editUserSchema : createUserSchema;
  const defaultValues: CreateEditUserFormValues = {
    username: username ?? "",
    password: "",
    email: email ?? "",
  };
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      const parsed = schema.parse(value);
      if (userId) {
        toast.loading(t("updating"), { id: 0 });
        updateUserMutation.mutate({
          id: userId,
          username: parsed.username,
          password: parsed.password || undefined,
          email: parsed.email ?? undefined,
        });
      } else {
        if (!entityId) {
          toast.warning("EntityId est requis pour la creation");
          return;
        }
        toast.loading(t("creating"), { id: 0 });
        createUserMutation.mutate({
          username: parsed.username,
          entityId: entityId,
          password: parsed.password,
          profile: type,
          email: parsed.email ?? undefined,
        });
      }
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

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-2 gap-x-4">
        <form.Field name="username">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("username")}</FieldLabel>
                <Input
                  id={field.name}
                  autoComplete="username"
                  placeholder="username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("password")}</FieldLabel>
              <Input
                id={field.name}
                type="password"
                autoComplete="current-password"
                placeholder={t("password")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

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
        <Button
          disabled={
            createUserMutation.isPending || updateUserMutation.isPending
          }
          type="submit"
        >
          {(createUserMutation.isPending || updateUserMutation.isPending) && (
            <Spinner />
          )}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
