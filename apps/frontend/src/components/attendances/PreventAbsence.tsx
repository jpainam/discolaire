import React, { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";
import { useUpload } from "~/hooks/use-upload";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { FileUploader } from "~/uploads/file-uploader";

const preventSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  reason: z.string().min(1),
  attachment: z.string().optional().default(""),
  observation: z.string().optional().default(""),
});
export function PreventAbsence({ studentId }: { studentId: string }) {
  const { closeModal } = useModal();
  const form = useForm({
    resolver: standardSchemaResolver(preventSchema),
    defaultValues: {
      from: new Date().toISOString(),
      to: new Date().toISOString(),
      attachment: "",
      observation: "",
      reason: "",
    },
  });

  const { unstable_onUpload: onUpload } = useUpload();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createPreventedAbsence = useMutation(
    trpc.absence.createPreventAbsence.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.absence.byStudent.pathFilter(),
        );
        setIsLoading(false);
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { t } = useLocale();
  const onSubmit = async (data: z.infer<typeof preventSchema>) => {
    setIsLoading(true);
    const uploadPromises = files.map((file) => {
      return onUpload(file);
    });
    const uploadState = await Promise.all(uploadPromises);
    const attachments = uploadState
      .map((state) => state.data?.id)
      .filter((v) => v != undefined);
    const values = {
      attachments: attachments,
      studentId: studentId,
      comment: data.observation,
      reason: data.reason,
      from: new Date(data.from),
      to: new Date(data.to),
    };
    createPreventedAbsence.mutate(values);
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
                <Input {...field} />
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
          <Button
            size={"sm"}
            isLoading={isLoading || createPreventedAbsence.isPending}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
