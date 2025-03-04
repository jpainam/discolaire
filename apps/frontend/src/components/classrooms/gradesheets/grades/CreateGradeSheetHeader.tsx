"use client";

import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { InputField } from "~/components/shared/forms/input-field";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";

export function CreateGradeSheetHeader({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string; classroomId: string }>();
  const router = useRouter();

  const { createQueryString } = useCreateQueryString();
  const form = useFormContext();
  return (
    <div className="grid flex-row gap-2 border-b md:flex">
      <div className="grid w-[75%] grid-cols-1 items-center gap-x-4 gap-y-2 border-r p-2 md:grid-cols-2">
        <FormField
          control={form.control}
          name="termId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("term")} </FormLabel>
              <FormControl>
                <TermSelector onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel>{t("subject")}</FormLabel>
              <FormControl>
                <SubjectSelector
                  onChange={field.onChange}
                  classroomId={params.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <InputField label={t("grade_name")} name="name" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <InputField name="scale" label={t("grade_scale")} type="number" />
          <FormField
            control={form.control}
            name={"weight"}
            render={({ field }) => (
              <FormItem className={cn("space-y-0")}>
                <FormLabel>{t("weight")} (0-100)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                  {/* <Slider
                  onValueChange={(val) => {
                    setWeight(val[0] ? val[0] : 0);
                    field.onChange(val[0]);
                  }}
                  defaultValue={[100]}
                  max={100}
                  step={10}
                  className="[&_[role=slider]]:h-8 [&_[role=slider]]:w-5 [&_[role=slider]]:rounded-md [&_[role=slider]]:border-neutral-100/10 [&_[role=slider]]:bg-neutral-900 [&_[role=slider]]:hover:border-[#13EEE3]/70"
                /> */}
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
                  createQueryString({})
              );
            }}
          >
            {t("cancel")}
          </Button>
          <Button isLoading={isSubmitting} type="submit">
            {t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
