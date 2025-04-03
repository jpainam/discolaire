"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/utils";
import React from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ImageCropper } from "~/components/image-cropper";
import { useLocale } from "~/i18n";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export function UserAvatar({
  userId,
  avatar,
  className,
}: {
  userId: string;
  className?: string;
  avatar?: string | null;
}) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

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

    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  const { t } = useLocale();
  return (
    <div>
      {selectedFile ? (
        <ImageCropper
          className={className}
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onComplete={async (croppedImage) => {
            toast.loading(t("uploading", { id: 0 }));
            await uploadToAWS(selectedFile, croppedImage, userId);
            toast.dismiss();
          }}
        />
      ) : (
        <Avatar {...getRootProps()} className={cn("cursor-pointer", className)}>
          <input {...getInputProps()} />
          <AvatarImage src={avatar ?? "/avatars/avatar-01.webp"} alt="Avatar" />
          <AvatarFallback className={className}>CN</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

async function uploadToAWS(
  file: File,
  croppedImageUrl: string,
  userId: string
) {
  const croppedBlob = await (await fetch(croppedImageUrl)).blob();
  //   const originalFormData = new FormData();
  //   originalFormData.append("file", file, "original.png");
  //   originalFormData.append("userId", userId);

  const croppedFormData = new FormData();
  croppedFormData.append("file", croppedBlob, "cropped.png");
  croppedFormData.append("userId", userId);

  //   await fetch("/api/upload/avatars", {
  //     method: "POST",
  //     body: originalFormData,
  //   });

  await fetch("/api/upload/avatars", {
    method: "POST",
    body: croppedFormData,
  });
}
