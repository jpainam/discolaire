"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";
import { useLocale } from "~/i18n";

import { SelectField } from "~/components/shared/forms/SelectField";

const importPhotoSchema = z.object({
  firstRow: z.boolean(),
  fieldDelimiter: z.string(),
  recordDelimiter: z.string(),
  target: z.string(),
});
type ImportPhotoFormValues = z.infer<typeof importPhotoSchema>;
export function ImportPhotos() {
  const { t } = useLocale();
  const form = useForm<ImportPhotoFormValues>({
    resolver: zodResolver(importPhotoSchema),
    defaultValues: {
      fieldDelimiter: ",",
      recordDelimiter: "CR",
      firstRow: true,
      target: "students",
    },
  });

  const onSubmit = (values: ImportPhotoFormValues) => {
    console.log(values);
  };
  const targetItems = [
    { value: "students", label: t("students") },
    { value: "staff", label: t("staffs") },
    { value: "parents", label: t("parents") },
    { value: "others", label: t("others") },
  ];
  const fieldDelimiterItems = [
    { value: ",", label: `${t("comma")}   ,` },
    { value: ";", label: `${t("semicolon")}  ;` },
    { value: " ", label: `${t("tab")}\t` },
  ];
  const recordDelimiterItems = [
    { value: "CR", label: t("CR") },
    { value: "CRLF", label: t("CRLF") },
    { value: "LF", label: t("LF") },
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="md:w-2/3">
          <fieldset className="gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              {t("importNewPhotos")}
            </legend>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <FormLabel htmlFor="target">{t("for")}</FormLabel>
              <SelectField
                name="target"
                className="w-full"
                placeholder={t("select_the_individual_type")}
                items={targetItems}
              />
              <Separator className="col-span-2" />
              <FormLabel>{t("fieldDelimiter")}</FormLabel>
              <SelectField
                name="fieldDelimiter"
                className="w-full"
                placeholder={t("select_the_field_delimiter")}
                items={fieldDelimiterItems}
              />
              <Separator className="col-span-2" />
              <FormLabel>{t("recordDelimiter")}</FormLabel>
              <SelectField
                name="recordDelimiter"
                className="w-full"
                placeholder={t("select_the_record_delimiter")}
                items={recordDelimiterItems}
              />
              <Separator className="col-span-2" />

              <FormField
                control={form.control}
                name="firstRow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("columnTitleOnFirstRow")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Separator className="col-span-2" />
              <div className="col-span-2 flex justify-end">
                <Button size={"sm"}>
                  <Upload className="mr-2 h-5 w-5" />
                  {t("submit")}
                </Button>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </Form>
  );
}
