"use client";

import { toast } from "sonner";

import { useModal } from "~/hooks/use-modal";
import { useUpload } from "~/hooks/use-upload";
import { useLocale } from "~/i18n";
import { FileUploader } from "~/uploads/file-uploader";

import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { useSchool } from "~/providers/SchoolProvider";
import { api } from "~/trpc/react";

export function ChangeAvatar({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const { closeModal } = useModal();
  const { school } = useSchool();

  const {
    unstable_onUpload: onUpload,
    isPending,
    //data: uploadedFiles,
  } = useUpload();
  const utils = api.useUtils();

  const router = useRouter();
  const updateStudentAvatarMutation = api.student.updateAvatar.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
      router.refresh();
    },
    onSettled: async () => {
      await utils.student.get.invalidate(studentId);
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

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
              destination: `${school.code}/avatars`,
              bucket: "TODO-UPLOAD",
              // TODO the key must be userId, and make sure this is called with the User,
              // will allow use in contact/staff as well
              key: studentId,
            }),
            {
              loading: t("uploading"),
              success: (result) => {
                const uploadedFile = result;
                if (!uploadedFile.data) {
                  toast.error("No file uploaded");
                  return;
                }
                const url = `${uploadedFile.data.url}${uploadedFile.data.id}`;
                updateStudentAvatarMutation.mutate({
                  id: studentId,
                  avatar: url,
                });
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
    </div>
  );
}
