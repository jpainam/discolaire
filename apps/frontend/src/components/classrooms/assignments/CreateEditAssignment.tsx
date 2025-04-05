/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

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
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";
import { FileUploader } from "~/uploads/file-uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DatePicker } from "~/components/DatePicker";
import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { AssignmentCategorySelector } from "~/components/shared/selects/AssignmentCategorySelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TiptapEditor } from "~/components/tiptap-editor";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

// const QuillEditor = dynamic(() => import("~/components/quill-editor"), {
//   ssr: false,
//   loading: () => <Skeleton className="min-h-[200px] w-full" />,
// });

type AssignemntGetProcedureOutput = NonNullable<
  RouterOutputs["assignment"]["get"]
>;

const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date(),
  termId: z.string().min(1),
  post: z.boolean().default(true),
  notify: z.boolean(),
  subjectId: z.coerce.number(),
  attachments: z.array(z.string()).optional(),
  from: z.coerce.date(),
  to: z.coerce.date(),

  visibles: z.array(z.string()).default([]),
});

export function CreateEditAssignment({
  assignment,
}: {
  assignment?: AssignemntGetProcedureOutput;
}) {
  const params = useParams<{ id: string }>();
  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      id: assignment?.id ?? "",
      subjectId: assignment?.subjectId ?? 0,
      attachments: assignment?.attachments ?? [],
      title: assignment?.title ?? "",
      termId: `${assignment?.termId}`,
      categoryId: assignment?.categoryId ?? "",
      description: assignment?.description ?? "",
      dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : new Date(),
      post: assignment?.post ?? true,
      notify: assignment?.notify ?? false,
      from: assignment?.from ?? new Date(),
      to: assignment?.to ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      visibles: assignment?.visibles ?? [],
    },
  });

  const visiblesTo = [
    {
      value: "student",
      label: "Student",
    },
    {
      value: "parent",
      label: "Parent",
    },
  ];

  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();
  const createAssignmentMutation = api.assignment.create.useMutation({
    onSettled: async () => {
      await utils.assignment.invalidate();
      await utils.classroom.assignments.invalidate(params.id);
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
    onSuccess: (result) => {
      toast.success(t("created_successfully"), { id: 0 });
      router.push(routes.classrooms.assignments.details(params.id, result.id));
    },
  });
  const updateAssignmentMutation = api.assignment.update.useMutation({
    onSettled: async () => {
      await utils.assignment.invalidate();
      await utils.classroom.assignments.invalidate(params.id);
    },
    onSuccess: (result) => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push(routes.classrooms.assignments.details(params.id, result.id));
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof assignmentSchema>) => {
    const values = {
      title: data.title,
      description: data.description ?? "",
      categoryId: data.categoryId,
      subjectId: data.subjectId,
      classroomId: params.id,
      attachments: data.attachments,
      from: data.from,
      termId: Number(data.termId),
      to: data.to,
      notify: data.notify,
      visibles: data.visibles,
    };
    if (assignment?.id) {
      toast.loading(t("updating"), { id: 0 });
      updateAssignmentMutation.mutate({
        id: assignment.id,
        ...values,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createAssignmentMutation.mutate({
        ...values,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center flex-row  gap-2 border-b bg-muted/50 px-4 py-1">
          <FormField
            control={form.control}
            name="termId"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-2 items-center">
                <FormLabel>{t("terms")}</FormLabel>
                <FormControl>
                  <TermSelector
                    className="md:w-64 w-full"
                    defaultValue={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              onClick={() => {
                router.push(routes.classrooms.assignments.index(params.id));
              }}
              variant={"outline"}
              type="button"
              size={"sm"}
            >
              {t("cancel")}
            </Button>
            <Button
              isLoading={createAssignmentMutation.isPending}
              type="submit"
              size={"sm"}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
        <div className="grid px-4 grid-cols-1 gap-2 md:gap-x-8 gap-y-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("title")}</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <FormControl>
                  <AssignmentCategorySelector
                    defaultValue={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("subject")}</FormLabel>
                <FormControl>
                  <SubjectSelector
                    onChange={(val) => field.onChange(val)}
                    classroomId={params.id}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <TiptapEditor
                    defaultContent={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="">
            <Label className=" ">{t("attachments")}</Label>
            <FileUploader
              maxFileCount={100}
              maxSize={1 * 1024 * 1024}
              onValueChange={(files) => {
                if (files.length === 0) {
                  return;
                }
                // toast.promise(onUpload(files), {
                //   loading: t("uploading"),
                //   success: () => {
                //     return t("uploaded_successfully");
                //   },
                //   error: (err) => {
                //     return getErrorMessage(err);
                //   },
                // });
              }}
              //progresses={progresses}
              //disabled={isUploading}
            />
          </div>
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("due_date")}</FormLabel>
                <FormControl>
                  <DatePicker
                    onChange={(val) => field.onChange(val)}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="from"
            render={() => (
              <FormItem>
                <FormLabel>{t("visble_from_to")}</FormLabel>
                <DateRangePicker
                  className="w-full"
                  from={form.getValues("from")}
                  to={form.getValues("to")}
                  onChange={(val) => {
                    if (val) {
                      const dateRange = val as { from: Date; to: Date };
                      form.setValue("from", dateRange.from);
                      form.setValue("to", dateRange.to);
                    }
                  }}
                />
              </FormItem>
            )}
          />
          <div></div>
          <div className="flex flex-row items-center gap-8">
            <FormField
              control={form.control}
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("send_notifications")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="post"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("post_to_calendar")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visibles"
            render={() => (
              <FormItem className="flex flex-row space-x-8 items-start">
                <FormLabel>{t("visible_to")}</FormLabel>

                {visiblesTo.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="visibles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.value}
                          className="flex flex-row items-start"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value ?? []).includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item.value,
                                    ])
                                  : field.onChange(
                                      (field.value ?? []).filter(
                                        (value) => value !== item.value,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel>{item.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
