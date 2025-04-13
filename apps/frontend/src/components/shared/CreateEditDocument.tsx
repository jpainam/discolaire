"use client";

import { FileIcon, Trash2, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
export function CreateEditDocument({
  documentId,
  title,
  description,
  entityId,
  entityType,
}: {
  documentId?: string;
  title?: string;
  description?: string;
  entityId: string;
  entityType: "student" | "contact" | "staff";
}) {
  const form = useForm({
    resolver: zodResolver(createEditDocumentSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createDocumentMutation = useMutation(
    trpc.document.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.document.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const updateDocumentMutation = useMutation(
    trpc.document.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.document.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const router = useRouter();
  const { closeModal } = useModal();
  const handleSubmit = async (
    data: z.infer<typeof createEditDocumentSchema>
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    try {
      //formData.append("file", croppedBlob, selectedFile?.name ?? "avatar.png");
      //formData.append("entityId", props.entityId ?? "");
      //formData.append("entityType", props.entityType ?? "");
      //formData.append("userId", props.userId ?? "");
      const response = await fetch("/api/upload/avatars", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast.success(t("success"), { id: 0 });
        router.refresh();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { error } = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        toast.error(error ?? response.statusText, { id: 0 });
      }
    } catch (error) {}
    const values = {
      title: data.title,
      description: data.description,
    };
    if (documentId) {
      toast.loading(t("updating"), { id: 0 });
      //updateDocumentMutation.mutate({ id: documentId, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      //createDocumentMutation.mutate(values);
    }
  };
  const { t } = useLocale();

  const filesList = files.map((file) => (
    <li key={file.name} className="relative">
      <Card className="relative p-4">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() =>
              setFiles((prevFiles) =>
                prevFiles.filter((prevFile) => prevFile.name !== file.name)
              )
            }
          >
            <Trash2 className="h-5 w-5 text-destructive" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="h-5 w-5 text-foreground" aria-hidden={true} />
          </span>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {file.size} bytes
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel htmlFor="description">{t("description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <Label htmlFor="file-upload-2" className="font-medium">
            File(s) upload
          </Label>
          <div
            {...getRootProps()}
            className={cn(
              isDragActive
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border",
              "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200"
            )}
          >
            <div>
              <FileIcon
                className="mx-auto h-12 w-12 text-muted-foreground/80"
                aria-hidden={true}
              />
              <div className="mt-4 flex text-muted-foreground">
                <p>Drag and drop or</p>
                <label
                  htmlFor="file"
                  className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
                >
                  <span>choose file(s)</span>
                  <input
                    {...getInputProps()}
                    id="file-upload-2"
                    name="file-upload-2"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">to upload</p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
            <span>All file types are allowed to upload.</span>
            <span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
          </p>
          {filesList.length > 0 && (
            <>
              <h4 className="mt-6 font-medium text-foreground">
                File(s) to upload
              </h4>
              <ul role="list" className="mt-4 space-y-4">
                {filesList}
              </ul>
            </>
          )}
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            type="button"
            variant={"outline"}
          >
            <XIcon className="h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button
            disabled={
              isLoading ||
              createDocumentMutation.isPending ||
              updateDocumentMutation.isPending
            }
            variant={"default"}
            size={"sm"}
            type="submit"
          >
            <UploadIcon /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
