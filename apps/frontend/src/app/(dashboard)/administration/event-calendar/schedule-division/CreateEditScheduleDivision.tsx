"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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

const formSchema = z.object({
  name: z.string().min(1),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  monday: z.boolean().default(false),
  tuesday: z.boolean().default(false),
  wednesday: z.boolean().default(false),
  thursday: z.boolean().default(false),
  friday: z.boolean().default(false),
  saturday: z.boolean().default(false),
  sunday: z.boolean().default(false),
});

export function CreateEditScheduleDivision({
  slot,
}: {
  slot?: RouterOutputs["scheduleDivision"]["all"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      name: slot?.name ?? "",
      startTime: slot?.startTime ?? new Date(),
      endTime: slot?.endTime ?? new Date(),
      monday: slot?.monday ?? false,
      tuesday: slot?.tuesday ?? false,
      wednesday: slot?.wednesday ?? false,
      thursday: slot?.thursday ?? false,
      friday: slot?.friday ?? false,
      saturday: slot?.saturday ?? false,
      sunday: slot?.sunday ?? false,
    },
  });
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const createScheduleDivisionMutation = useMutation(
    trpc.scheduleDivision.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleDivision.pathFilter());
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  // const formatDate = (date: Date | null) =>
  //   date instanceof Date && !isNaN(date.getTime())
  //     ? date.toISOString().split("T")[0]
  //     : "";

  const updateScheduleDivisionMutation = useMutation(
    trpc.scheduleDivision.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleDivision.pathFilter());
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const t = useTranslations();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (slot) {
      updateScheduleDivisionMutation.mutate({
        id: slot.id,
        ...values,
      });
    } else {
      createScheduleDivisionMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Label")} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startTime")}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    // defaultValue={formatDate(field.value)}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startTime")}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    // defaultValue={formatDate(field.value)}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <DayCheckBox name="monday" />
          <DayCheckBox name="tuesday" />
          <DayCheckBox name="wednesday" />
          <DayCheckBox name="thursday" />
          <DayCheckBox name="friday" />
          <DayCheckBox name="saturday" />
          <DayCheckBox name="sunday" />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createScheduleDivisionMutation.isPending ||
              updateScheduleDivisionMutation.isPending
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

function DayCheckBox({ name }: { name: string }) {
  const form = useFormContext();
  const t = useTranslations();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          </FormControl>
          <FormLabel>{t(name)}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
