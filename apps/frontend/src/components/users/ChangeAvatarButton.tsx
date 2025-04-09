"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { ImageUpIcon } from "lucide-react";
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

export function ChangeAvatarButton({
  userId,
  className,
}: {
  userId: string;
  className?: string;
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

    [],
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
          className={
            "size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
          }
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
        <Button
          variant={"outline"}
          size={"sm"}
          {...getRootProps()}
          className={cn("cursor-pointer", className)}
        >
          <input {...getInputProps()} />
          <ImageUpIcon />
          {t("change_avatar")}
        </Button>
      )}
    </div>
  );
}

async function uploadToAWS(
  file: File,
  croppedImageUrl: string,
  userId: string,
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
