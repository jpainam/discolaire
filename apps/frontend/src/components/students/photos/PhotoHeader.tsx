"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useUpload } from "@repo/hooks/use-upload";
import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/components/label";

import { useSchool } from "~/contexts/SchoolContext";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { sidebarIcons } from "../sidebar-icons";

export function PhotoHeader() {
  const { t } = useLocale();
  const { school } = useSchool();
  const Icon = sidebarIcons.photos;
  const { onUpload, data: uploadedFiles, isPending } = useUpload();
  const handleUpload = (file: File) => {
    toast.promise(
      onUpload(file, {
        destination: `${school.code}/photos`,
      }),
      {
        loading: t("uploading"),
        success: () => {
          return t("uploaded_successfully");
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      },
    );
  };
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const addStudentPhotoMutation = api.student.addPhoto.useMutation({
    onSuccess: () => {
      toast.success(t("added_successfully"));
    },
    onSettled: async () => {
      await utils.student.get.invalidate(params.id);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[0];
      const url = uploadedFile?.data?.id;
      if (!url) return;
      addStudentPhotoMutation.mutate({
        id: params.id,
        url: url,
      });
    }
  }, [addStudentPhotoMutation, params.id, uploadedFiles]);
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary p-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("photos")}</Label>
      <div className="ml-auto">
        <input
          disabled={isPending}
          type="file"
          onChange={(file) => {
            const files = file.target.files;
            if (files && files.length > 0 && files[0]) {
              handleUpload(files[0]);
            }
          }}
        />
        {/* <Button  variant={"outline"} size={"sm"}>
          <UploadIcon className="mr-2 h-4 w-4" />
          {t("upload")}
        </Button> */}
      </div>
    </div>
  );
}
