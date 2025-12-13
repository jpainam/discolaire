"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Label } from "~/components/ui/label";
import { useUpload } from "~/hooks/use-upload";
import { getErrorMessage } from "~/lib/handle-error";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { sidebarIcons } from "../sidebar-icons";

export function PhotoHeader() {
  const t = useTranslations();
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const addStudentPhotoMutation = useMutation(
    trpc.student.addPhoto.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("added_successfully"));
      },

      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );
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
    <div className="bg-secondary text-secondary-foreground flex flex-row items-center gap-2 border-b p-1">
      {Icon && <Icon className="h-4 w-4" />}
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
