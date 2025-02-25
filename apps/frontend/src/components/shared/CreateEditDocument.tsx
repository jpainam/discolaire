"use client";

import { Trash2, UploadIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useUpload } from "~/hooks/use-upload";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { FileUploader } from "~/uploads/file-uploader";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useSchool } from "~/providers/SchoolProvider";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().optional(),
});
export function CreateEditDocument({
  documentId,
  title,
  description,
  url,
  ownerId,
}: {
  documentId?: string;
  title?: string;
  description?: string;
  url?: string;
  ownerId: string;
}) {
  const form = useForm({
    schema: createEditDocumentSchema,
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      url: url ?? "",
    },
  });
  const utils = api.useUtils();
  const router = useRouter();

  const createDocumentMutation = api.document.create.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: () => {
      router.refresh();
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateDocumentMutation = api.document.update.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: () => {
      router.refresh();
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof createEditDocumentSchema>) => {
    if (!data.url) {
      toast.error(t("please_upload_a_file"), { id: 0 });
      return;
    }
    const values = {
      title: data.title,
      description: data.description,
      url: data.url,
      ownerId: ownerId,
    };
    if (documentId) {
      toast.loading(t("updating"), { id: 0 });
      updateDocumentMutation.mutate({ id: documentId, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createDocumentMutation.mutate(values);
    }
  };
  const { t } = useLocale();
  const {
    onUpload,
    isPending,
    data: uploadedFiles,
    clearUploadedFiles,
  } = useUpload();

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[0];
      const url = uploadedFile?.data?.id;
      form.setValue("url", url);
    }
  }, [form, uploadedFiles]);

  const { school } = useSchool();

  const handleUpload = (file: File) => {
    toast.promise(
      onUpload(file, {
        destination: `${school.code}/documents`,
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
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel htmlFor="title">{t("title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel htmlFor="description">{t("description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {uploadedFiles.length > 0 ? (
          <div className="flex flex-row items-stretch justify-between">
            <span className="line-clamp-1 flex-1 overflow-ellipsis text-sm">
              {uploadedFiles[0]?.file.name}
            </span>
            <Button
              onClick={() => {
                form.setValue("url", "");
                clearUploadedFiles();
              }}
              size={"icon"}
              variant={"ghost"}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <FileUploader
            maxFileCount={1}
            disabled={isPending}
            maxSize={1 * 1024 * 1024}
            onValueChange={(files) => {
              if (files.length === 0) {
                toast.warning(t("please_upload_a_file"), { id: 0 });
                return;
              }
              const file = files[0];
              if (!file) {
                toast.warning(t("please_upload_a_file"), { id: 0 });
                return;
              }
              handleUpload(file);
            }}
            //progresses={progresses}
          />
        )}

        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            type="button"
            variant={"outline"}
          >
            <XIcon className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button
            disabled={
              isPending ||
              createDocumentMutation.isPending ||
              updateDocumentMutation.isPending
            }
            variant={"default"}
            size={"sm"}
            type="submit"
          >
            <UploadIcon className="mr-2 h-4 w-4" /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
