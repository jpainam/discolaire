"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileIcon, Trash2, UploadIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { cn, formatBytes } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
export function CreateEditDocument({
  documentId,
  title,
  description,
  userId,
}: {
  documentId?: string;
  title?: string;
  description?: string;
  userId: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditDocumentSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) =>
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]),
  });

  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createDocumentMutation = useMutation(
    trpc.document.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.documents.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.staff.documents.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateDocumentMutation = useMutation(
    trpc.document.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.documents.pathFilter());
        await queryClient.invalidateQueries(
          trpc.student.documents.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { closeModal } = useModal();
  const handleSubmit = async (
    data: z.infer<typeof createEditDocumentSchema>,
  ) => {
    const values = {
      title: data.title,
      description: data.description,
      userId: userId,
    };

    if (documentId) {
      toast.loading(t("updating"), { id: 0 });
      updateDocumentMutation.mutate({ id: documentId, ...values });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    formData.append("userId", userId);

    const response = await fetch("/api/upload/documents", {
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
      createDocumentMutation.mutate({
        ...values,
        attachments: attachments,
      });
      setIsLoading(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };

  const filesList = files.map((file) => (
    <li key={file.name}>
      <Card className="relative p-2">
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() =>
              setFiles((prevFiles) =>
                prevFiles.filter((prevFile) => prevFile.name !== file.name),
              )
            }
          >
            <Trash2 className="text-destructive h-5 w-5" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-2 p-0">
          <span className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <FileIcon className="text-foreground h-5 w-5" aria-hidden={true} />
          </span>
          <div>
            <p className="text-foreground text-sm">{file.name}</p>
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.size)}
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

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
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!documentId && (
          <div className="col-span-full flex flex-col gap-2">
            <Label htmlFor="file-upload-2" className="font-medium">
              {t("documents")}
            </Label>
            <div
              {...getRootProps()}
              className={cn(
                isDragActive
                  ? "border-primary bg-primary/10 ring-primary/20 ring-2"
                  : "border-border",
                "flex justify-center rounded-md border border-dashed py-4 transition-colors duration-200",
              )}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-2 sm:px-5">
                  <UploadIcon className="text-muted-foreground size-5" />
                  <p className="text-muted-foreground text-sm font-medium">
                    Drop the files here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 sm:px-5">
                  <UploadIcon className="text-muted-foreground size-5" />
                  <div className="flex flex-col items-center justify-center gap-px">
                    <p className="text-muted-foreground text-sm font-medium">
                      Drag {`'n'`} drop files here, or click to select files
                    </p>
                    <p className="text-muted-foreground/70 text-xs">
                      You can upload multiple files (up to{" "}
                      {formatBytes(10000000)} each)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {filesList.length > 0 && (
              <ScrollArea className="h-fit w-full">
                <ul role="list" className="mt-2 space-y-2">
                  {filesList}
                </ul>
              </ScrollArea>
            )}
          </div>
        )}
        <div className="ml-auto flex flex-row items-center gap-4">
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
            isLoading={
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
