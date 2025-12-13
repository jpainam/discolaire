"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { SubmitButton } from "~/components/SubmitButton";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(1),
  typeId: z.string().min(1),
  date: z.date(),
});
export function CreateEditSchoolYearEvent({
  event,
}: {
  event?: RouterOutputs["schoolYearEvent"]["all"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: event?.name ?? "",
      date: event?.date ?? new Date(),
      typeId: event?.typeId ?? "",
    },
  });
  const trpc = useTRPC();

  const { data: eventTypes } = useSuspenseQuery(
    trpc.schoolYearEvent.eventTypes.queryOptions(),
  );

  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const createEventMutation = useMutation(
    trpc.schoolYearEvent.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.schoolYearEvent.all.pathFilter(),
        );
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateEventMutation = useMutation(
    trpc.schoolYearEvent.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.schoolYearEvent.all.pathFilter(),
        );
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const t = useTranslations();

  // Add new event
  const handleAddEvent = (data: z.infer<typeof schema>) => {
    const values = {
      name: data.name,
      typeId: data.typeId,
      date: data.date,
    };
    if (event) {
      updateEventMutation.mutate({
        ...values,
        id: event.id,
      });
    } else {
      createEventMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddEvent)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Event date")}</FormLabel>
                <FormControl>
                  <DatePicker
                    defaultValue={field.value}
                    onSelectAction={(v) => field.onChange(v)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Event types")}</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => {
              closeModal();
            }}
          >
            {t("close")}
          </Button>
          <SubmitButton
            isSubmitting={
              createEventMutation.isPending || updateEventMutation.isPending
            }
            size={"sm"}
          >
            {t("submit")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
