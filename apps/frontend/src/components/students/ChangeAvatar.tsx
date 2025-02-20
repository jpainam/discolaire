"use client";

import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useUpload } from "@repo/hooks/use-upload";
import { useLocale } from "@repo/i18n";
import { FileUploader } from "@repo/ui/components/uploads/file-uploader";

import { useSchool } from "~/contexts/SchoolContext";
import { getErrorMessage } from "~/lib/handle-error";
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
  //const router = useRouter();
  const updateStudentAvatarMutation = api.student.updateAvatar.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
      //router.refresh();
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
              bucket: "discolaire-public",
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
