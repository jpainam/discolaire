"use client";

import { toast } from "sonner";
import * as z from "zod";

import { useUpload } from "@repo/hooks/use-upload";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { FileUploader } from "@repo/ui/uploads/file-uploader";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  authorization: z.string().optional(),
  ministry: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  headmaster: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().default(true),
});

export function EditSchoolForm() {
  const { t } = useLocale();
  const utils = api.useUtils();
  const createSchoolMutation = api.school.create.useMutation({
    onSettled: () => utils.school.all.invalidate(),
    onSuccess: () => {
      toast.success("created_successfully", { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { onUpload, isPending, data: uploadedFiles } = useUpload();

  const form = useForm({
    schema: formSchema,
    defaultValues: {
      isActive: true,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    createSchoolMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2"
      >
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
                destination: "/logos",
              }),
              {
                loading: t("uploading"),
                success: () => {
                  if (uploadedFiles.length > 0) {
                    const uploadedFile = uploadedFiles[0];
                    console.log("setting up url", uploadedFile?.data?.url);
                    form.setValue("logo", uploadedFile?.data?.url);
                  }
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

        <Button isLoading={createSchoolMutation.isPending} type="submit">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
