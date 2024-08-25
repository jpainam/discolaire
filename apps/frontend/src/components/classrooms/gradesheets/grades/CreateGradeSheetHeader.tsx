"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

import { useLocale } from "@repo/i18n";
import { useCreateQueryString } from "@repo/lib/hooks/create-query-string";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import FlatBadge from "@repo/ui/FlatBadge";
import { FormControl, FormField, FormItem, FormLabel } from "@repo/ui/form";
import { Label } from "@repo/ui/label";
import { Slider } from "@repo/ui/slider";

import { DatePicker } from "~/components/shared/date-picker";
import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { InputField } from "~/components/shared/forms/input-field";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";

export function CreateGradeSheetHeader() {
  const { t } = useLocale();
  const params = useParams() as { id: string };
  const router = useRouter();
  const [weight, setWeight] = useState<number>(100);
  const { createQueryString } = useCreateQueryString();
  const form = useFormContext();
  return (
    <div className="grid flex-row gap-2 border-b md:flex">
      <div className="grid w-[85%] grid-cols-1 items-center gap-4 border-r p-2 lg:grid-cols-2 xl:grid-cols-3">
        <FormField
          control={form.control}
          name="termId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("term")} </FormLabel>
              <FormControl>
                <TermSelector
                  // defaultValue={field.value ? field.value : null}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem className="w-full space-y-1">
              <FormLabel>{t("subject")}</FormLabel>
              <FormControl>
                <SubjectSelector
                  onChange={field.onChange}
                  classroomId={params.id}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Label>{t("grade_date")}</Label>
          <DatePicker defaultValue={new Date()} />
        </div>
        <InputField label={t("grade_name")} name="name" />
        <InputField name="scale" label={t("grade_scale")} type="number" />
        <FormField
          control={form.control}
          name={"weight"}
          render={({ field }) => (
            <FormItem className={cn("space-y-1")}>
              <FormLabel>
                {t("weight")} -{" "}
                <FlatBadge
                  variant={
                    weight <= 25 ? "red" : weight <= 50 ? "yellow" : "green"
                  }
                >
                  {field.value}%
                </FlatBadge>
              </FormLabel>
              <FormControl>
                <Slider
                  onValueChange={(val) => {
                    setWeight(val[0] ? val[0] : 0);
                    field.onChange(val[0]);
                  }}
                  defaultValue={[100]}
                  max={100}
                  step={10}
                  className="[&_[role=slider]]:h-8 [&_[role=slider]]:w-5 [&_[role=slider]]:rounded-md [&_[role=slider]]:border-neutral-100/10 [&_[role=slider]]:bg-neutral-900 [&_[role=slider]]:hover:border-[#13EEE3]/70"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col justify-between gap-4 py-2">
        {/* <span className="font-semibold">{t("notifications")}</span> */}
        <div className="flex flex-col gap-4">
          <CheckboxField label={t("notify_parents")} name="notifyParents" />
          <CheckboxField label={t("notify_students")} name="notifyStudents" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={"outline"}
            onClick={() => {
              router.push(
                routes.classrooms.gradesheets.index(params.id) +
                  "?" +
                  createQueryString({}),
              );
            }}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </div>
    </div>
  );
}
