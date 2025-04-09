"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import type { School } from "@repo/db";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useLocale } from "~/i18n";
import { FileUploader } from "~/uploads/file-uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1),
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
  //logo: z.string().optional(),
  isActive: z.boolean().default(true),
});

export function CreateEditSchoolForm({ school }: { school: School }) {
  const { t } = useLocale();

  const params = useParams<{ schoolId: string }>();
  const [file, setFile] = useState<File | null>(null);

  const utils = api.useUtils();
  const router = useRouter();

  const updateSchoolMutation = api.school.update.useMutation({
    onSettled: () => utils.school.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push("/administration/my-school");
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school.name,
      authorization: school.authorization ?? "",
      ministry: school.ministry ?? "",
      department: school.department ?? "",
      address: school.address ?? "",
      region: school.region ?? "",
      city: school.city ?? "",
      headmaster: school.headmaster ?? "",
      phoneNumber1: school.phoneNumber1 ?? "",
      phoneNumber2: school.phoneNumber2 ?? "",
      email: school.email ?? "",
      website: school.website ?? "",
      isActive: school.isActive,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast.loading(t("updating"), { id: 0 });
    if (!file) {
      updateSchoolMutation.mutate({ id: school.id, ...data });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("schoolId", params.schoolId);

    try {
      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const { url } = (await response.json()) as { url: string };
        updateSchoolMutation.mutate({ id: school.id, logo: url, ...data });
      } else {
        const { message } = await response.json();
        toast.error(message, { id: 0 });
      }
    } catch (error) {
      toast.error((error as Error).message, { id: 0 });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 pt-8 md:grid-cols-2"
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
          maxSize={1 * 1024 * 1024}
          onValueChange={(files) => {
            if (files.length === 0) {
              return;
            }
            const file = files[0];
            if (!file) {
              toast.error("No file uploaded");
              return;
            }
            setFile(file);
          }}
          //progresses={progresses}
        />

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
        <Button isLoading={updateSchoolMutation.isPending} type="submit">
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
