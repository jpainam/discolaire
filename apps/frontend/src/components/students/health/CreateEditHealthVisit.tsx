"use client";

import { useState } from "react";
import { FileUploader } from "@/components/uploads/file-uploader";
import { useLocale } from "@/hooks/use-locale";
import { useSheet } from "@/hooks/use-sheet";
import { useUploadFile } from "@/hooks/use-upload-file";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createEditVisitSchema = z.object({
  date: z.coerce.date(),
  complaint: z.string(),
  signs: z.string(),
  examination: z.string(),
  assessment: z.string(),
  plan: z.string(),
  notify: z.boolean().default(true),
  files: z.array(z.instanceof(File)),
});

export function CreateEditHealthVisit({ healthVisit }: { healthVisit?: any }) {
  const { t } = useLocale();
  const form = useForm<z.infer<typeof createEditVisitSchema>>({
    defaultValues: {
      date: healthVisit?.date || new Date(),
      complaint: healthVisit?.complaint || "",
      signs: healthVisit?.signs || "",
      examination: healthVisit?.examination || "",
      assessment: healthVisit?.assessment || "",
      plan: healthVisit?.plan || "",
      files: [],
    },
    resolver: zodResolver(createEditVisitSchema),
  });
  const [loading, setLoading] = useState(false);
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] },
  );
  const { closeSheet } = useSheet();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={"mb-4 h-[90vh] overflow-y-auto"}>
          <div className="flex flex-col gap-2 px-4">
            <span className="text-2xl font-semibold leading-none tracking-tight">
              Patient Visit Notes
            </span>
            <span className="text-sm text-muted-foreground">
              Record details from the patient's medical visit.
            </span>
          </div>
          <div className="flex w-full flex-col gap-4 px-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" placeholder="John Doe" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit-date">Date of Visit</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      <div className="mr-2 h-4 w-4 opacity-50" />
                      <span>Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chief-complaint">Chief Complaint</Label>
              <Textarea
                id="chief-complaint"
                placeholder="Describe the patient's main concern"
              />
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="signs">
                <AccordionTrigger>
                  <Label htmlFor="signs">Vital Signs</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    name="signs"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          {...field}
                          id="signs"
                          placeholder="Record vital signs"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="examination">
                <AccordionTrigger>
                  <Label htmlFor="examination">Examination Findings</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    name="examination"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          id="examination"
                          {...field}
                          placeholder="Describe examination findings"
                        />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="assessment">
                <AccordionTrigger>
                  <Label htmlFor="assessment">Assessment</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    name="assessment"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          id="assessment"
                          {...field}
                          placeholder="Provide assessment of the patient's condition"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="plan">
                <AccordionTrigger>
                  <Label htmlFor="plan">Plan of Care</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          id="plan"
                          {...field}
                          placeholder="Outline the plan of care for the patient"
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
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FileUploader
                            value={field.value}
                            accept={{ "application/*": [], "image/*": [] }}
                            onValueChange={field.onChange}
                            maxFileCount={4}
                            maxSize={4 * 1024 * 1024}
                            progresses={progresses}
                            // pass the onUpload function here for direct upload
                            // onUpload={uploadFiles}
                            disabled={isUploading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <FormField
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
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
        </div>
        <Separator />
        <div className="grid justify-end gap-4 p-4 md:flex">
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">Save Notes</Button>
        </div>
      </form>
    </Form>
  );
}
