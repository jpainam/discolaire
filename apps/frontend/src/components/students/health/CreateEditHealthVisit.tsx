/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  FileIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
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
import { Textarea } from "@repo/ui/components/textarea";

import { DatePicker } from "~/components/DatePicker";
import { formatBytes, useFileUpload } from "~/hooks/use-file-upload";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFileIcon } from "~/utils/file-icon";

const createEditVisitSchema = z.object({
  date: z.date().default(() => new Date()),
  complaint: z.string().min(1),
  signs: z.string().optional(),
  examination: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  notify: z.boolean().default(true),
  //attachments: z.array(z.instanceof(File)),
  attachments: z.array(z.string()).default([]),
});

export function CreateEditHealthVisit({
  healthVisit,
  userId,
  name,
}: {
  healthVisit?: RouterOutputs["health"]["visits"][number];
  userId: string;
  name: string;
}) {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: standardSchemaResolver(createEditVisitSchema),
    defaultValues: {
      date: healthVisit?.date ?? new Date(),
      notify: true,

      complaint: healthVisit?.complaint ?? "",
      signs: healthVisit?.signs ?? "",
      examination: healthVisit?.examination ?? "",
      assessment: healthVisit?.assessment ?? "",
      plan: healthVisit?.plan ?? "",
      attachments: [],
    },
  });
  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
  });

  const router = useRouter();

  const createVisitMutation = useMutation(
    trpc.health.createVisit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        router.push(`/students/${params.id}/health`);
      },

      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );
  const onSubmit = async (data: z.infer<typeof createEditVisitSchema>) => {
    const values = {
      ...data,
      userId: userId,
    };
    toast.loading(t("creating"), { id: 0 });
    if (files.length == 0) {
      createVisitMutation.mutate(values);
      return;
    }
    const formData = new FormData();
    files.forEach((fileWithPreview) => {
      formData.append(
        "files",
        fileWithPreview.file as File,
        fileWithPreview.file.name,
      );
    });
    formData.append("userId", userId);

    const response = await fetch("/api/upload/health", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const results = (await response.json()) as {
        key: string;
        fullPath: string;
      }[];
      const attachments = results.map((result) => result.key);
      toast.loading(t("creating"), { id: 0 });
      createVisitMutation.mutate({
        ...values,
        attachments: attachments,
      });
    } else {
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1">
          <Label>{t("patient_visit_notes")}</Label>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={"outline"}
              type="button"
              size={"sm"}
              onClick={() => {
                router.push(`/students/${params.id}/health`);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              size={"sm"}
              isLoading={createVisitMutation.isPending}
              type="submit"
            >
              {t("submit")}
            </Button>
          </div>
        </div>
        <span className="text-muted-foreground px-4 text-sm">
          {t("patient_visit_notes_description")}
        </span>

        <div className="grid gap-x-8 gap-y-6 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="patient-name">{t("patient_name")}</Label>
                <Input id="patient-name" placeholder={name} disabled />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("date_of_visit")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        defaultValue={field.value}
                        onSelectAction={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("chief_complaint")}</FormLabel>
                  <FormControl>
                    <Textarea
                      id="chief-complaint"
                      placeholder={t("chief_complaint_placeholder")}
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-2 pt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="notify"
                      defaultChecked
                    />
                  </FormControl>
                  <FormLabel htmlFor="notify">
                    {t("send_notification")}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="signs">
              <AccordionTrigger>
                <Label htmlFor="signs">{t("vital_signs")}</Label>
              </AccordionTrigger>
              <AccordionContent className="px-2 pt-1">
                <FormField
                  name="signs"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        {...field}
                        className="resize-none"
                        id="signs"
                        placeholder={t("vital_signs_placeholder")}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="examination">
              <AccordionTrigger>
                <Label htmlFor="examination">{t("examination_findings")}</Label>
              </AccordionTrigger>
              <AccordionContent className="px-2 pt-1">
                <FormField
                  name="examination"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        id="examination"
                        className="resize-none"
                        {...field}
                        placeholder={t("examination_findings_placeholder")}
                      />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="assessment">
              <AccordionTrigger>
                <Label htmlFor="assessment">{t("assessment")}</Label>
              </AccordionTrigger>
              <AccordionContent className="px-2 pt-1">
                <FormField
                  name="assessment"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        id="assessment"
                        className="resize-none"
                        {...field}
                        placeholder={t("assessment_placeholder")}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="plan">
              <AccordionTrigger>
                <Label htmlFor="plan">{t("plan_of_care")}</Label>
              </AccordionTrigger>
              <AccordionContent className="px-2 pt-1">
                <FormField
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        id="plan"
                        className="resize-none"
                        {...field}
                        placeholder={t("plan_of_care_placeholder")}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="files">
              <AccordionTrigger>
                <Label htmlFor="files">
                  {t("files")} {files.length > 0 ? <>({files.length})</> : ""}
                </Label>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {/* Drop area */}
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
                  >
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload files"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <FileIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        {t("upload_files")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        type="button"
                        onClick={openFileDialog}
                      >
                        <UploadIcon
                          className="-ms-1 opacity-60"
                          aria-hidden="true"
                        />
                        {t("Select files")}
                      </Button>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-col space-y-2">
                      <div className="ml-auto flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={openFileDialog}
                        >
                          <UploadCloudIcon
                            className="-ms-0.5 size-3.5 opacity-60"
                            aria-hidden="true"
                          />
                          {t("Add files")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={clearFiles}
                        >
                          <Trash2Icon
                            className="-ms-0.5 size-3.5 opacity-60"
                            aria-hidden="true"
                          />
                          {t("Remove all")}
                        </Button>
                      </div>

                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                              {getFileIcon(file)}
                            </div>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="truncate text-[13px] font-medium">
                                {file.file instanceof File
                                  ? file.file.name
                                  : file.file.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatBytes(
                                  file.file instanceof File
                                    ? file.file.size
                                    : file.file.size,
                                )}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                            onClick={() => removeFile(file.id)}
                            aria-label="Remove file"
                          >
                            <XIcon className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.length > 0 && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{errors[0]}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </form>
    </Form>
  );
}
