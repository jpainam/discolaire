"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function EmploymentTypeSelector({
  onSelectAction,
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className?: string;
  onSelectAction: (value: string | null) => void;
}) {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(trpc.employmentType.all.queryOptions());
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        if (value == "create") {
          openModal({
            title: t("create"),
            description: t("employmentType"),
            view: <CreateEmploymentType />,
          });
        } else {
          onSelectAction(value);
        }
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={"Type"} />
      </SelectTrigger>
      <SelectContent>
        {isPending && (
          <SelectItem value="-1">
            <Skeleton className="h-8 w-full" />
          </SelectItem>
        )}
        {data?.map((d, index) => (
          <SelectItem key={index} value={d.id}>
            {d.name}
          </SelectItem>
        ))}

        <SelectItem value="create">
          <PlusIcon /> {t("create")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
const formSchema = z.object({
  name: z.string().min(1),
});
function CreateEmploymentType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createEmploymentMutation = useMutation(
    trpc.employmentType.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.employmentType.pathFilter());
      },
    }),
  );
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const t = useTranslations();
  const { closeModal } = useModal();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-6"
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("Label")}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Login button not working on mobile"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("cancel")}
        </Button>
        <Button type="submit">
          {createEmploymentMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
