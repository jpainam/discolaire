"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import type { School } from "@repo/db";
import { useUpload } from "~/hooks/use-upload";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { FileUploader } from "~/uploads/file-uploader";
import { useLocale } from "~/i18n";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function CreateEditSchoolForm({ school }: { school: School }) {
  const { t } = useLocale();
  const form = useFormContext();
  const params = useParams<{ schoolId: string }>();
  const { onUpload, isPending, data: uploadedFiles } = useUpload();
  const updateLogoMutation = api.school.updateLogo.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[0];
      if (uploadedFile?.data?.id && uploadedFile.data.url) {
        const url = `${uploadedFile.data.url}${uploadedFile.data.id}`;
        updateLogoMutation.mutate({
          id: params.schoolId,
          logo: url,
        });
        //form.setValue("logo", url);
      }
    }
  }, [uploadedFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="authorization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("authorization")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ministry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ministry")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("department")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("region")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("city")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="headmaster"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("headmaster")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("phoneNumber")} 1</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("phoneNumber")} 2</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("email")}</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("website")}</FormLabel>
            <FormControl>
              <Input type="url" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            toast.error("");
            return;
          }
          toast.promise(
            onUpload(file, {
              destination: `${school.code}`,
              bucket: "discolaire-public",
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
        }}
        //progresses={progresses}
      />
      {/* {uploadedFiles.map((d, index) => (
        <div key={index}>
          <p>File: {d.file.name}</p>
          {d.isPending && <p>Uploading...</p>}
          {!d.isPending && (
            <p>Upload complete! File ID: {JSON.stringify(d.data)}</p>
          )}
          {<p>Error: {JSON.stringify(d.error)}</p>}
        </div>
      ))} */}

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t("address")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t("is_active")}</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
