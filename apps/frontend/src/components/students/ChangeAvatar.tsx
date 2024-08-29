"use client";

import * as React from "react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useUpload } from "@repo/hooks/use-upload";
import { useLocale } from "@repo/i18n";
import { FileUploader } from "@repo/ui/uploads/file-uploader";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function ChangeAvatar({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const { closeModal } = useModal();

  const { onUpload, isPending, data: uploadedFiles } = useUpload();
  const updateStudentAvatarMutation = api.student.updateAvatar.useMutation();

  React.useEffect(() => {
    if (uploadedFiles.length == 0) {
      return;
    }
    // @ts-expect-error - TODO  fix this
    const avatarId = uploadedFiles[0].data?.id;
    if (avatarId) {
      updateStudentAvatarMutation.mutate({
        id: studentId,
        avatar: avatarId,
      });
    }
  }, [studentId, uploadedFiles, updateStudentAvatarMutation]);

  return (
    <div>
      <FileUploader
        maxFileCount={1}
        disabled={isPending}
        maxSize={1 * 1024 * 1024}
        onValueChange={(files) => {
          if (files.length === 0) {
            return;
          }
          const file = files[0];
          if (!file) {
            toast.error("No file selected");
            return;
          }

          toast.promise(
            onUpload(file, {
              destination: "avatars",
            }),
            {
              loading: t("uploading"),
              success: () => {
                closeModal();
                return t("uploaded_successfully");
              },
              error: (err) => {
                return getErrorMessage(err);
              },
            },
          );
        }}
        //progresses={progresses}
      />
      {uploadedFiles.map((d, index) => (
        <div key={index}>
          <p>File: {d.file.name}</p>
          {d.isPending && <p>Uploading...</p>}
          {!d.isPending && (
            <p>Upload complete! File ID: {JSON.stringify(d.data)}</p>
          )}
          {<p>Error: {JSON.stringify(d.error)}</p>}
        </div>
      ))}
    </div>
  );
}
