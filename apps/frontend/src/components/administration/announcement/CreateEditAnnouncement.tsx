"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { Separator } from "@repo/ui/components/separator";
import { Textarea } from "@repo/ui/components/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { RecipientMultiSelector } from "~/components/shared/selects/RecipientMultiSelector";
import { getErrorMessage } from "~/lib/handle-error";
import { SelectField } from "../../shared/forms/SelectField";

type AnnouncementGetProcedureOutput = NonNullable<
  RouterOutputs["announcement"]["get"]
>;

interface CreateEditNoticeBoardProps {
  noticeBoard?: AnnouncementGetProcedureOutput;
}

const noticeBoardSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
  level: z.string(),
  recipients: z.array(z.string()),
});

export function CreateEditAnnouncement({
  noticeBoard,
}: CreateEditNoticeBoardProps) {
  const { t } = useLocale();

  type UpdateNoticeBoardValues = z.infer<typeof noticeBoardSchema>;

  const form = useForm<UpdateNoticeBoardValues>({
    resolver: zodResolver(noticeBoardSchema),
    defaultValues: {
      id: noticeBoard?.id ?? 0, // Generate a unique ID if not provided
      title: noticeBoard?.title ?? "",
      description: noticeBoard?.description ?? "",
      link: noticeBoard?.link ?? "",
      from: noticeBoard?.from ?? undefined,
      to: noticeBoard?.to ?? undefined,
      level: noticeBoard?.level ?? "ℹ️ Information",
      //recipients: noticeBoard?.recipients ?? ["All"],
    },
  });

  const { watch } = form;

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type),
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const { closeSheet } = useSheet();
  //const updateAnnouncementMutation = api.announcement.update.useMutation();
  //const createAnnouncementMutation = api.announcement.create.useMutation();

  function onSubmit(data: UpdateNoticeBoardValues) {
    console.log("Submitting data:", data);
    const values = {
      ...data,
    };
    console.log(values);

    if (noticeBoard) {
      toast.promise(
        Promise.resolve(),
        // updateAnnouncementMutation.mutateAsync({
        //   id: noticeBoard.id,
        //   ...values,
        // }),
        {
          loading: t("updating"),
          success: () => {
            closeSheet();
            return t("updated_successfully");
          },
          error: (error) => {
            return getErrorMessage(error);
          },
        },
      );
    } else {
      toast.promise(
        Promise.resolve(),
        // createAnnouncementMutation.mutateAsync(values),
        {
          loading: t("creating"),
          success: () => {
            closeSheet();
            return t("created_successfully");
          },
          error: (error) => {
            return getErrorMessage(error);
          },
        },
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-10rem)] items-start overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-full gap-y-1 space-y-0">
                  <FormLabel>{t("title")}</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{t("description")}</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Enter your event description"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="col-span-full gap-y-1 space-y-0">
                  <FormLabel>URL</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("from")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("to")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      defaultValue={field.value?.toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Level")}</FormLabel>
                  <SelectField
                    {...field}
                    placeholder={t("level")}
                    items={[
                      { label: "🔴 Critical", value: "🔴 Critical" },
                      { label: "❗ Warning", value: "❗ Warning" },
                      { label: "ℹ️ Information", value: "ℹ️ Information" },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Recipients")}</FormLabel>
                  <FormControl>
                    <RecipientMultiSelector
                      onChange={(values) => {
                        form.setValue("recipients", values);
                        field.onChange(values);
                      }}
                      defaultValues={[]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-row justify-end gap-4 p-2">
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            variant={"default"}
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            {noticeBoard ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
