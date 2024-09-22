"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Loader, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
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
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";
import { FileUploader } from "@repo/ui/uploads/file-uploader";

import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";

const QuillEditor = dynamic(() => import("@repo/ui/quill-editor"), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[200px] w-full" />,
});

type AssignemntGetProcedureOutput = NonNullable<
  RouterOutputs["assignment"]["get"]
>;

const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  links: z.array(z.string().url()).optional(),
  dueDate: z.date(),
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
    schema: assignmentSchema,
    defaultValues: {
      title: assignment?.title ?? "",
      categoryId: assignment?.categoryId ?? "",
      description: assignment?.description ?? "",
      links: assignment?.links ?? [],
      dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : new Date(),
      post: assignment?.post ?? true,
      notify: assignment?.notify ?? false,
      from: assignment?.from ?? new Date(),
      to: assignment?.to ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      visibles: assignment?.visibles ?? [],
    },
  });
  const assignmentCategoriesQuery = api.assignment.categories.useQuery();
  const assignmentSubjectsQuery = api.classroom.subjects.useQuery({
    id: params.id,
  });
  const [link, setLink] = useState("");

  const handleRemoveLink = (index: number) => {
    const currentLinks = form.getValues("links");
    const newLinks = currentLinks?.filter((_, i) => i !== index);
    form.setValue("links", newLinks);
  };

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

  const isValidURL = (url: string) => {
    const regex =
      /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|localhost)(:[0-9]{1,5})?(\/[^\s]*)?$/i;
    return regex.test(url);
  };

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
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      router.push(routes.classrooms.assignments.index(params.id));
    },
  });
  const updateAssignmentMutation = api.assignment.update.useMutation({
    onSettled: async () => {
      await utils.assignment.invalidate();
      await utils.classroom.assignments.invalidate(params.id);
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push(routes.classrooms.assignments.index(params.id));
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
      termId: 43,
      to: data.to,
      links: data.links,
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t("Title")}</FormLabel>
                <InputField {...field} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t("Category")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_an_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentCategoriesQuery.isPending && (
                      <SelectItem value="0">
                        <Loader className="w-8 animate-spin" />
                      </SelectItem>
                    )}
                    {assignmentCategoriesQuery.data?.map((cat) => (
                      <SelectItem
                        key={cat.id.toString()}
                        value={cat.id.toString()}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{t("Subject")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_an_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentSubjectsQuery.isPending && (
                      <SelectItem value="0">
                        <Loader className="w-8 animate-spin" />
                      </SelectItem>
                    )}
                    {assignmentSubjectsQuery.data?.map((sub) => (
                      <SelectItem
                        key={sub.id.toString()}
                        value={sub.id.toString()}
                      >
                        {sub.course?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormItem className="col-span-full mb-16">
                <FormLabel>{t("Description")}</FormLabel>
                <QuillEditor
                  className="h-full min-h-[200px]"
                  onChange={onChange}
                  value={value}
                />
              </FormItem>
            )}
          />

          <div className="col-span-full my-4">
            <Label className=" ">Attachments</Label>
            <FileUploader
              className="mt-4"
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
            name="links"
            render={() => (
              <FormItem className="col-span-full mt-8 lg:mt-2">
                <FormLabel>{t("Links")}</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setLink(e.target.value);
                      form.clearErrors("links");
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (link) {
                        if (isValidURL(link)) {
                          form.setValue("links", [
                            ...(form.getValues("links") ?? []),
                            link,
                          ]);
                          setLink("");
                          form.clearErrors("links");
                        } else {
                          form.setError("links", {
                            type: "manual",
                            message: "Invalid link",
                          });
                        }
                      }
                    }}
                  >
                    {t("Add Link")}
                  </Button>
                </div>
                <FormMessage />
                <div className="flex flex-wrap gap-4 pt-2">
                  {form.getValues("links")?.map((link, index) => (
                    <div key={index}>
                      <Badge variant="secondary" className="px-4 py-2">
                        {link}
                        <span
                          className="ml-2 cursor-pointer"
                          onClick={() => handleRemoveLink(index)}
                        >
                          <X size="14" />
                        </span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="">
                <DatePickerField label={t("Due Date")} {...field} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="from"
            render={() => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("Visible From - To")}</FormLabel>
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

          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
          <FormField
            control={form.control}
            name="notify"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
            name="visibles"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{t("visible_to")}</FormLabel>
                </div>
                {visiblesTo.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="visibles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item.value,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.value,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-full" />
          <div className="col-span-full flex justify-end">
            <Button type="submit" size={"sm"}>
              {t("Submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
