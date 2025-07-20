"use client";

import type { PropsWithChildren } from "react";
import type { FileWithPath } from "react-dropzone";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@repo/ui/lib/utils";

import { ImageCropper } from "~/components/image-cropper";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export function ChangeAvatarButton(
  props: PropsWithChildren<{
    className?: string;
    userId: string;
  }>,
) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        toast.error("Selected image is too large!");
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },

    [],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  const { t } = useLocale();

  const handleUpload = useCallback(
    async (croppedImageUrl: string) => {
      toast.loading(t("Processing..."), { id: 0 });
      try {
        const croppedBlob = await (await fetch(croppedImageUrl)).blob();
        const formData = new FormData();
        formData.append(
          "file",
          croppedBlob,
          selectedFile?.name ?? "avatar.png",
        );

        formData.append("userId", props.userId);
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
      } catch (error) {
        toast.error("Something went wrong while uploading", { id: 0 });
        console.error(error);
      }
    },
    [props.userId, router, selectedFile?.name, t],
  );

  return (
    <div>
      {selectedFile ? (
        <ImageCropper
          className={
            "size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2"
          }
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onComplete={(croppedImage) => {
            void handleUpload(croppedImage);
          }}
        >
          {props.children}
        </ImageCropper>
      ) : (
        <div
          {...getRootProps({})}
          className={cn("cursor-pointer", props.className)}
        >
          <input {...getInputProps()} />
          {props.children}
        </div>
      )}
    </div>
  );
}
