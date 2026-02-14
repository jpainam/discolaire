"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { FileText, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { DateRangePicker } from "~/components/DateRangePicker";
import { AssignmentCategorySelector } from "~/components/shared/selects/AssignmentCategorySelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TiptapEditor } from "~/components/tiptap-editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { cn, formatBytes } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

type AssignmentGetProcedureOutput = NonNullable<
  RouterOutputs["assignment"]["get"]
>;

const visibleTargets = ["student", "parent"] as const;
const maxAttachmentCount = 100;
const maxAttachmentSize = 1 * 1024 * 1024;
const assignmentFileAccept =
  "application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function isAcceptedAssignmentFile(file: File) {
  if (file.type.startsWith("image/")) {
    return true;
  }
  if (
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return true;
  }

  const ext = file.name.toLowerCase().split(".").pop();
  return ext === "pdf" || ext === "docx";
}

const createEditAssignmentSchema = z
  .object({
    title: z.string().min(1),
    categoryId: z.string().min(1),
    description: z.string(),
    dueDate: z.date(),
    termId: z.string().min(1),
    post: z.boolean(),
    notify: z.boolean(),
    subjectId: z.number().int().positive(),
    attachments: z.array(z.string()),
    from: z.date(),
    to: z.date(),
    visibles: z.array(z.enum(visibleTargets)),
  })
  .superRefine((value, ctx) => {
    if (value.to < value.from) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "End date must be after start date",
      });
    }
  });

const assignmentPayloadSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    categoryId: z.string(),
    subjectId: z.number(),
    classroomId: z.string(),
    attachments: z.array(z.string()).optional(),
    dueDate: z.date().optional(),
    post: z.boolean().optional(),
    from: z.date(),
    termId: z.string().min(1),
    to: z.date(),
    notify: z.boolean().optional(),
    visibles: z.array(z.string()).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.to < value.from) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "End date must be after start date",
      });
    }
  });

type CreateEditAssignmentFormValues = z.infer<
  typeof createEditAssignmentSchema
>;

function toDate(value: Date | string | null | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export function CreateEditAssignment({
  assignment,
}: {
  assignment?: AssignmentGetProcedureOutput;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const defaultValues = useMemo<CreateEditAssignmentFormValues>(
    () => ({
      subjectId: assignment?.subjectId ?? 0,
      attachments: assignment?.attachments ?? [],
      title: assignment?.title ?? "",
      termId: assignment?.termId ?? "",
      categoryId: assignment?.categoryId ?? "",
      description: assignment?.description ?? "",
      dueDate: toDate(assignment?.dueDate, new Date()),
      post: assignment?.post ?? true,
      notify: assignment?.notify ?? false,
      from: toDate(assignment?.from, new Date()),
      to: toDate(assignment?.to, addDays(new Date(), 7)),
      visibles: (assignment?.visibles ?? []).filter((value) =>
        visibleTargets.includes(value as (typeof visibleTargets)[number]),
      ) as (typeof visibleTargets)[number][],
    }),
    [assignment],
  );

  const createAssignmentMutation = useMutation(
    trpc.assignment.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.assignment.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        router.push(
          routes.classrooms.assignments.details(params.id, result.id),
        );
      },
    }),
  );

  const updateAssignmentMutation = useMutation(
    trpc.assignment.update.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.assignment.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        router.push(
          routes.classrooms.assignments.details(params.id, result.id),
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createEditAssignmentSchema,
    },
    onSubmit: async ({ value }) => {
      let parsed: z.output<typeof createEditAssignmentSchema>;
      try {
        parsed = createEditAssignmentSchema.parse(value);
      } catch {
        return;
      }

      try {
        const uploadedAttachments = await handleUpload();

        const payload = assignmentPayloadSchema.parse({
          title: parsed.title,
          description: parsed.description,
          categoryId: parsed.categoryId,
          subjectId: parsed.subjectId,
          classroomId: params.id,
          attachments: Array.from(
            new Set([...parsed.attachments, ...uploadedAttachments]),
          ),
          dueDate: parsed.dueDate,
          post: parsed.post,
          from: parsed.from,
          termId: parsed.termId,
          to: parsed.to,
          notify: parsed.notify,
          visibles: parsed.visibles,
        });

        if (assignment?.id) {
          toast.loading(t("updating"), { id: 0 });
          updateAssignmentMutation.mutate({
            id: assignment.id,
            ...payload,
          });
          return;
        }

        toast.loading(t("creating"), { id: 0 });
        createAssignmentMutation.mutate(payload);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to upload attachments",
          { id: 0 },
        );
      }
    },
  });

  const isSubmitted = useStore(form.store, (state) => state.isSubmitted);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isBusy =
    isSubmitting ||
    createAssignmentMutation.isPending ||
    updateAssignmentMutation.isPending;

  const onUpload = useCallback(
    async (inputFiles: File[]) => {
      const formData = new FormData();
      for (const file of inputFiles) {
        formData.append("files", file, file.name);
      }
      formData.append("classroomId", params.id);

      const response = await fetch("/api/upload/assignments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response
          .json()
          .catch(() => ({ error: response.statusText }))) as {
          error?: string;
        };
        throw new Error(payload.error ?? response.statusText);
      }

      const results = (await response.json()) as {
        key: string;
        fullPath: string;
      }[];
      return results.map((result) => result.key);
    },
    [params.id],
  );

  const handleAddFiles = useCallback(
    (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) {
        return;
      }
      setFiles((previousFiles) => {
        const nextFiles = [...previousFiles];
        const keys = new Set(previousFiles.map((file) => fileKey(file)));

        for (const file of incomingFiles) {
          if (nextFiles.length >= maxAttachmentCount) {
            toast.error(`Cannot upload more than ${maxAttachmentCount} files`, {
              id: 0,
            });
            break;
          }

          if (file.size > maxAttachmentSize) {
            toast.error(
              `${file.name} exceeds ${formatBytes(maxAttachmentSize)}`,
              {
                id: 0,
              },
            );
            continue;
          }

          if (!isAcceptedAssignmentFile(file)) {
            toast.error(`${file.name} is not a supported file type`, { id: 0 });
            continue;
          }

          const key = fileKey(file);
          if (keys.has(key)) {
            continue;
          }

          nextFiles.push(file);
          keys.add(key);
        }

        return nextFiles;
      });
    },
    [setFiles],
  );

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      return [];
    }
    return onUpload(files);
  }, [files, onUpload]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (isBusy) {
        return;
      }
      setIsDragging(false);
      handleAddFiles(Array.from(event.dataTransfer.files));
    },
    [handleAddFiles, isBusy],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!isBusy) {
        setIsDragging(true);
      }
    },
    [isBusy],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handlePickFiles = useCallback(() => {
    if (!isBusy) {
      fileInputRef.current?.click();
    }
  }, [isBusy]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleAddFiles(Array.from(event.target.files ?? []));
      event.target.value = "";
    },
    [handleAddFiles],
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((previousFiles) => previousFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="bg-muted/50 flex items-center gap-2 border-y px-4 py-1">
        <form.Field name="termId">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field orientation={"horizontal"}>
                <FieldLabel htmlFor={field.name}>{t("terms")}</FieldLabel>
                <TermSelector
                  className="w-full md:w-64"
                  defaultValue={field.state.value || undefined}
                  onChange={(value) => field.handleChange(value ?? "")}
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              router.push(routes.classrooms.assignments.index(params.id));
            }}
            variant="outline"
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button disabled={isBusy} type="submit">
            {isBusy && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 gap-y-4 px-4 md:grid-cols-3 md:gap-x-8">
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("title")}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
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

        <form.Field name="categoryId">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("category")}</FieldLabel>
                <AssignmentCategorySelector
                  defaultValue={field.state.value || undefined}
                  onChange={field.handleChange}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="subjectId">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("subject")}</FieldLabel>
                <SubjectSelector
                  defaultValue={
                    field.state.value > 0
                      ? String(field.state.value)
                      : undefined
                  }
                  onChange={(value) => field.handleChange(Number(value ?? 0))}
                  classroomId={params.id}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid} className="col-span-2">
                <FieldLabel htmlFor={field.name}>{t("description")}</FieldLabel>
                <TiptapEditor
                  defaultContent={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="attachments">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t("attachments")}</FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={assignmentFileAccept}
                className="hidden"
                disabled={isBusy}
                onChange={handleInputChange}
              />
              <div
                role="button"
                tabIndex={isBusy ? -1 : 0}
                onClick={handlePickFiles}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(event) => {
                  if (isBusy) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePickFiles();
                  }
                }}
                className={cn(
                  "relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all",
                  isBusy ? "cursor-not-allowed opacity-70" : "",
                  isDragging && !isBusy
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
                )}
              >
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <Upload className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">
                    {isDragging
                      ? "Drop files here"
                      : "Drag and drop files or click to browse"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    PDF, images, DOCX up to {formatBytes(maxAttachmentSize)}
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={fileKey(file)}
                      className="bg-muted/40 flex items-center gap-3 rounded-md border p-2"
                    >
                      <FileText className="text-muted-foreground h-4 w-4" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {file.name}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {field.state.value.length > 0 && (
                <Label className="text-muted-foreground text-xs">
                  {field.state.value.length} existing attachment(s)
                </Label>
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="dueDate">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("due_date")}</FieldLabel>
                <DatePicker
                  onSelectAction={(value) =>
                    field.handleChange(value ?? field.state.value)
                  }
                  defaultValue={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="from">
          {(field) => {
            const toValue = form.getFieldValue("to");
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("visble_from_to")}
                </FieldLabel>
                <DateRangePicker
                  className="w-full"
                  defaultValue={{ from: field.state.value, to: toValue }}
                  onSelectAction={(value) => {
                    if (value?.from) {
                      field.handleChange(value.from);
                    }
                    if (value?.to) {
                      form.setFieldValue("to", value.to);
                    }
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="to">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field data-invalid={isInvalid} className="col-span-3 -mt-2">
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex flex-row items-center gap-8">
          <form.Field name="notify">
            {(field) => (
              <Field orientation="horizontal" className="items-start">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <FieldLabel htmlFor={field.name}>
                  {t("send_notifications")}
                </FieldLabel>
              </Field>
            )}
          </form.Field>

          <form.Field name="post">
            {(field) => (
              <Field orientation="horizontal" className="items-start">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <FieldLabel htmlFor={field.name}>
                  {t("post_to_calendar")}
                </FieldLabel>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="visibles">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || isSubmitted);
            return (
              <Field
                orientation="horizontal"
                className="items-start justify-start gap-8"
                data-invalid={isInvalid}
              >
                <FieldLabel>{t("visible_to")}</FieldLabel>
                <div className="flex flex-row gap-4">
                  {visibleTargets.map((target) => {
                    const id = `visible-${target}`;
                    const currentValue = field.state.value;
                    const isChecked = currentValue.includes(target);
                    return (
                      <Label
                        key={target}
                        htmlFor={id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={id}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              field.handleChange([
                                ...new Set([...currentValue, target]),
                              ]);
                              return;
                            }
                            field.handleChange(
                              currentValue.filter((value) => value !== target),
                            );
                          }}
                        />
                        {target === "student" ? "Student" : "Parent"}
                      </Label>
                    );
                  })}
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>
    </form>
  );
}
