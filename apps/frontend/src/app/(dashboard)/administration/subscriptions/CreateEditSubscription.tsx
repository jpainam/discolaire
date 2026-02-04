/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { UserSelector } from "~/components/shared/selects/UserSelector";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { Spinner } from "~/components/ui/spinner";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  userId: z.string().min(1),
  emails: z.number().default(0),
  unlimitedEmails: z.boolean().default(false),
  sms: z.number().default(0),
  unlimitedSms: z.boolean().default(false),
  whatsapp: z.number().default(0),
  unlimitedWhatsapp: z.boolean().default(false),
  plan: z.string().default("hobby"),
});
export function CreateEditSubscription({
  subscription,
}: {
  subscription?: RouterOutputs["notificationSubscription"]["all"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      userId: "",
      emails: 0,
      plan: "hobby",
      unlimitedEmails: false,
      sms: 0,
      unlimitedSms: false,
      whatsapp: 0,
      unlimitedWhatsapp: false,
    },
  });
  const trpc = useTRPC();

  const t = useTranslations();
  const { closeSheet } = useSheet();
  const queryClient = useQueryClient();
  const upsertSubscriptionMutation = useMutation(
    trpc.notificationSubscription.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.count.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.loading(t("Processing"), { id: 0 });
    upsertSubscriptionMutation.mutate({
      entityId: data.userId,
      plan: data.plan,
      channel: "EMAIL",
      profile: "student",
      balance: data.unlimitedSms ? -1 : data.sms,
      //email: data.unlimitedEmails ? -1 : data.emails,
      //whatsapp: data.unlimitedWhatsapp ? -1 : data.whatsapp,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 px-4">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{t("user")}</FormLabel>
                <FormControl>
                  <UserSelector {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Plan")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("plan")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hobby">Hobby</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="full">{t("full")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_emails")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_emails")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedEmails"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_emails")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="sms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_sms")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_sms")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedSms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_sms")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_whatsapp_messages")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("number_of_whatsapp_messages")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unlimitedWhatsapp"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("unlimited_whatsapp_messages")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-end gap-4 p-4">
          <Button
            type="button"
            onClick={() => {
              closeSheet();
            }}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button disabled={upsertSubscriptionMutation.isPending} type="submit">
            {upsertSubscriptionMutation.isPending && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
