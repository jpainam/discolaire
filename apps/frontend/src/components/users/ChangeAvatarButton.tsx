"use client";

import type { PropsWithChildren } from "react";
import type { FileWithPath } from "react-dropzone";
import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { handleUploadAvatar } from "~/actions/upload";
import { ImageCropper } from "~/components/image-cropper";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export function ChangeAvatarButton(
  props: PropsWithChildren<{
    className?: string;
    id: string;
    profile: string;
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

  const t = useTranslations();

  const handleUpload = useCallback(
    async (croppedImageUrl: string) => {
      toast.loading(t("Processing"), { id: 0 });

      try {
        if (!selectedFile) {
          return;
        }
        const croppedBlob = await (await fetch(croppedImageUrl)).blob();

        const file = new File([croppedBlob], selectedFile.name, {
          type: croppedBlob.type || "application/octet-stream",
          lastModified: Date.now(),
        });
        const result = await handleUploadAvatar(file, props.id, props.profile);

        if (result.success) {
          toast.success(t("success"), { id: 0 });
          router.refresh();
        } else {
          toast.error("Une erreur s'est produite");
        }
      } catch (error) {
        toast.error("Something went wrong while uploading", { id: 0 });
        console.error(error);
      }
    },
    [props.id, props.profile, router, selectedFile, t],
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
