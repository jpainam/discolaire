/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";
import { useUpload } from "~/hooks/use-upload";
import { useLocale } from "~/i18n";
import { FileUploader } from "~/uploads/file-uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DatePicker } from "~/components/DatePicker";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { useSchool } from "~/providers/SchoolProvider";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils";

const createEditVisitSchema = z.object({
  date: z.coerce.date().default(() => new Date()),
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
}: {
  healthVisit?: RouterOutputs["health"]["visits"][number];
  userId: string;
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(params.id);
  const student = studentQuery.data;
  const form = useForm({
    resolver: zodResolver(createEditVisitSchema),
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
  const {
    onUpload,
    isPending,
    data: uploadedFiles,
    //clearUploadedFiles,
  } = useUpload();

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const urls: string[] = uploadedFiles
        .map((file) => file.data?.id)
        .filter((url) => url !== undefined);
      //console.log("The attachments", urls);
      form.setValue("attachments", urls as never);
    }
  }, [form, uploadedFiles]);

  const { school } = useSchool();

  const handleUpload = (files: File[]) => {
    if (!student) return;
    toast.promise(
      onUpload(files, {
        destination: `${school.code}/health-visit-attachments`,
      }),
      {
        loading: t("uploading"),
        success: () => {
          return t("uploaded_successfully");
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      }
    );
  };

  const router = useRouter();
  const utils = api.useUtils();
  const createVisitMutation = api.health.createVisit.useMutation({
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      router.push(routes.students.health.index(params.id));
    },
    onSettled: () => utils.health.invalidate(),
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createEditVisitSchema>) => {
    const values = {
      ...data,
      userId: userId,
    };
    toast.loading(t("creating"), { id: 0 });
    createVisitMutation.mutate(values);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-row items-center gap-2 border-b bg-muted/50 px-4 py-2">
          <Label>{t("patient_visit_notes")}</Label>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => {
                router.push(routes.students.health.index(params.id));
              }}
            >
              {t("cancel")}
            </Button>
            <Button isLoading={createVisitMutation.isPending} type="submit">
              {t("submit")}
            </Button>
          </div>
        </div>
        <span className="px-4 text-sm text-muted-foreground">
          {t("patient_visit_notes_description")}
        </span>

        <div className="grid gap-x-8 gap-y-6 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="patient-name">{t("patient_name")}</Label>
                {studentQuery.isPending ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <Input
                    id="patient-name"
                    placeholder={getFullName(studentQuery.data)}
                    disabled
                  />
                )}
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
                        onChange={(val) => field.onChange(val)}
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
                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-8">
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
                <Label htmlFor="files">{t("files")}</Label>
              </AccordionTrigger>
              <AccordionContent className="px-2 pt-1">
                <Label>{t("files")}</Label>
                <FileUploader
                  disabled={isPending}
                  //accept={{ "application/*": [], "image/*": [] }}
                  onValueChange={(files) => {
                    if (files.length === 0) {
                      toast.warning(t("please_upload_a_file"), { id: 0 });
                      return;
                    }

                    handleUpload(files);
                  }}
                  maxFileCount={4}
                  maxSize={4 * 1024 * 1024}
                  //progresses={progresses}
                  // pass the onUpload function here for direct upload
                  // onUpload={uploadFiles}
                  //disabled={isUploading}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </form>
    </Form>
  );
}
