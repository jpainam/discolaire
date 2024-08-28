/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";

import { InputField } from "~/components/shared/forms/input-field";

export function CreateEditPeriodicAttendance() {
  const form = useForm();
  const { t } = useLocale();
  const { closeModal } = useModal();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <InputField
            name="absences"
            labelClassName="w-[300px]"
            label={t("total_absences")}
            inputClassName="h-8"
            className="flex flex-row items-center"
          />
          <InputField
            name="justified"
            inputClassName="h-8"
            labelClassName="w-[300px]"
            label={t("total_absences")}
            className="flex flex-row items-center"
          />
          <InputField
            name="consignes"
            inputClassName="h-8"
            labelClassName="w-[300px]"
            label={t("total_absences")}
            className="flex flex-row items-center"
          />
        </div>
        <div className="ml-auto flex flex-row gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
