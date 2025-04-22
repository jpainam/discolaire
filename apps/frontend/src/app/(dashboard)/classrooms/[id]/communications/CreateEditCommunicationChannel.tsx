"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@repo/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["WHATSAPP", "SMS", "EMAIL", "TELEGRAM", "OTHER"]),
  url: z.string().url(),
});
export function CreateEditCommunicationChannel({
  channel,
}: {
  channel?: RouterOutputs["communicationChannel"]["all"][number];
}) {
  const params = useParams<{ id: string }>();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: channel?.name ?? "",
      description: channel?.description ?? "",
      type: channel?.type ?? "WHATSAPP",
      url: channel?.url ?? "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createCommunicationChannel = useMutation(
    trpc.communicationChannel.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.communicationChannel.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { closeModal } = useModal();
  const updateCommunicationChannel = useMutation(
    trpc.communicationChannel.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.communicationChannel.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading(t("Processing..."), { id: 0 });
    const values = {
      name: data.name,
      description: data.description,
      type: data.type,
      url: data.url,
    };
    if (channel) {
      updateCommunicationChannel.mutate({ ...values, id: channel.id });
    } else {
      createCommunicationChannel.mutate({
        ...values,
        classroomId: params.id,
      });
    }
  };
  const { t } = useLocale();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("type")}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="TELEGRAM">Telegram</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              size={"sm"}
              type="button"
              variant="outline"
              onClick={() => closeModal()}
            >
              {t("cancel")}
            </Button>
            <Button
              isLoading={
                updateCommunicationChannel.isPending ||
                createCommunicationChannel.isPending
              }
              type="submit"
              size={"sm"}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
