import React, { useState } from "react";
import { Paperclip } from "lucide-react";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useUpload } from "@repo/hooks/use-upload";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
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
import { Textarea } from "@repo/ui/textarea";
import { FileUploader } from "@repo/ui/uploads/file-uploader";

import { AttendanceReasonSelector } from "./AttendanceReasonSelector";

const preventSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  reason: z.coerce.number(),
  attachment: z.string().optional().default(""),
  observation: z.string().optional().default(""),
});
export function PreventAbsence({ studentId }: { studentId: string }) {
  const { closeModal } = useModal();
  const form = useForm({
    schema: preventSchema,
    defaultValues: {
      from: new Date().toISOString(),
      to: new Date().toISOString(),
      attachment: "",
      observation: "",
    },
  });
  console.log(studentId);
  const { unstable_onUpload: onUpload } = useUpload();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();
  const onSubmit = async (values: z.infer<typeof preventSchema>) => {
    console.log(values);
    setIsLoading(true);
    const uploadPromises = files.map((file) => {
      return onUpload(file);
    });
    const uploadState = await Promise.all(uploadPromises);
    console.log(uploadState);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("from")}</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("to")}</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("reason")}</FormLabel>
              <FormControl>
                <AttendanceReasonSelector
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size={"icon"}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload files</DialogTitle>
                <DialogDescription>
                  Drag and drop your files here or click to browse.
                </DialogDescription>
              </DialogHeader>
              <FileUploader
                maxFileCount={8}
                maxSize={8 * 1024 * 1024}
                onValueChange={setFiles}
              />
            </DialogContent>
          </Dialog>
          <span className="text-xs">
            {files.length > 0
              ? `Added files ${files.length}`
              : t("add_a_justification")}
          </span>
        </div>

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("comment")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("add_a_comment")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} isLoading={isLoading} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
