"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileIcon, Trash2, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { cn, formatBytes } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { Spinner } from "../ui/spinner";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
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
  entityType: "staff" | "student" | "contact" | "classroom";
}) {
  const t = useTranslations();
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createDocumentMutation = useMutation(
    trpc.document.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.documents.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.staff.documents.pathFilter());
        await queryClient.invalidateQueries(trpc.document.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateDocumentMutation = useMutation(
    trpc.document.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.documents.pathFilter());
        await queryClient.invalidateQueries(trpc.document.pathFilter());
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

  const handleFile = useCallback((nextFile: File | null) => {
    setFile(nextFile);
    if (!nextFile && inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile],
  );

  const form = useForm({
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
    },
    validators: {
      onSubmit: createEditDocumentSchema,
    },
    onSubmit: async ({ value }) => {
      if (documentId) {
        toast.loading(t("updating"), { id: 0 });
        updateDocumentMutation.mutate({
          id: documentId,
          title: value.title,
          description: value.description,
        });
        return;
      }

      if (!file) {
        toast.error("Please select a document file.", { id: 0 });
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("entityId", entityId);
      formData.append("entityType", entityType);

      const response = await fetch("/api/upload/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error?: string };
        toast.error(error ?? response.statusText, { id: 0 });
        setIsLoading(false);
        return;
      }

      const results = (await response.json()) as {
        key: string;
        fullPath: string;
      }[];
      const uploaded = results[0];

      if (!uploaded) {
        toast.error("Upload failed.", { id: 0 });
        setIsLoading(false);
        return;
      }

      toast.loading(t("creating"), { id: 0 });
      createDocumentMutation.mutate({
        title: value.title,
        description: value.description,
        type: "OTHER",
        mime: file.type || "application/octet-stream",
        size: file.size,
        url: uploaded.key,
        entityId,
        entityType,
      });
      setIsLoading(false);
    },
  });

  const isSubmitting =
    isLoading ||
    createDocumentMutation.isPending ||
    updateDocumentMutation.isPending;

  return (
    <div className="grid gap-4">
      <form
        id="create-document-form"
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
          />
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("description")}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    rows={4}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {!documentId && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="document-file" className="font-medium">
              {t("documents")}
            </Label>
            <input
              ref={inputRef}
              id="document-file"
              type="file"
              onChange={handleChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <div
              onClick={() => {
                if (!isSubmitting) {
                  inputRef.current?.click();
                }
              }}
              onDrop={isSubmitting ? undefined : handleDrop}
              onDragOver={isSubmitting ? undefined : handleDragOver}
              onDragLeave={isSubmitting ? undefined : handleDragLeave}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed py-4 transition-colors duration-200",
                isSubmitting && "cursor-not-allowed opacity-70",
                isDragging
                  ? "border-primary bg-primary/10 ring-primary/20 ring-2"
                  : "border-border",
              )}
            >
              <UploadIcon className="text-muted-foreground size-5" />
              <div className="flex flex-col items-center justify-center gap-px">
                <p className="text-muted-foreground text-xs">
                  {isDragging
                    ? "Drop the file here"
                    : "Drag and drop a file here, or click to select"}
                </p>
                <p className="text-muted-foreground/70 text-xs">
                  Single file upload (up to {formatBytes(10000000)})
                </p>
              </div>
            </div>

            {file && (
              <Card className="relative p-2">
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove file"
                    onClick={() => handleFile(null)}
                    disabled={isSubmitting}
                  >
                    <Trash2
                      className="text-destructive h-5 w-5"
                      aria-hidden={true}
                    />
                  </Button>
                </div>
                <CardContent className="flex items-center space-x-2 p-0">
                  <span className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <FileIcon
                      className="text-foreground h-5 w-5"
                      aria-hidden={true}
                    />
                  </span>
                  <div>
                    <p className="text-foreground max-w-[160px] truncate text-xs">
                      {file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </form>

      <Field orientation="horizontal" className="flex items-center justify-end">
        <Button type="button" variant="outline" onClick={() => closeModal()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          form="create-document-form"
        >
          {isSubmitting && <Spinner />}
          {t("submit")}
        </Button>
      </Field>
    </div>
  );
}
