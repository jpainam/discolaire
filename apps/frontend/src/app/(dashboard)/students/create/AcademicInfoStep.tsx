"use client";

import type { z } from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { Building } from "lucide-react";
import { useTranslations } from "next-intl";

import { DatePicker } from "~/components/DatePicker";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useStudentFormContext } from "./StudentFormContext";
import { academicInfoSchema } from "./validation";

export function AcademicInfoStep({
  onNextAction,
}: {
  onNextAction: () => void;
}) {
  const t = useTranslations();
  const { academicInfo, setAcademicInfo } = useStudentFormContext();
  const defaultValues: z.input<typeof academicInfoSchema> = academicInfo;

  const form = useForm({
    defaultValues,
    validators: { onSubmit: academicInfoSchema },
    onSubmit: ({ value }) => {
      setAcademicInfo({
        ...value,
        dateOfEntry: value.dateOfEntry ?? new Date(),
        isRepeating: value.isRepeating ?? false,
        isNew: value.isNew ?? true,
        status: value.status ?? "ACTIVE",
      });
      onNextAction();
    },
  });

  return (
    <form
      id="student-academic-info-form"
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            {t("Academic Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="gird-cols-1 grid gap-4 md:grid-cols-3">
          <form.Field
            name="classroomId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("classroom")}</FieldLabel>
                  <ClassroomSelector
                    onSelect={(value) => field.handleChange(value ?? undefined)}
                    defaultValue={field.state.value}
                    className="w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="isRepeating"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("repeating")}</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      field.handleChange(val === "yes");
                    }}
                    defaultValue={field.state.value ? "yes" : "no"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("yes")}</SelectItem>
                      <SelectItem value="no">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="isNew"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("is_new")} ?</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      field.handleChange(val === "yes");
                    }}
                    defaultValue={field.state.value ? "yes" : "no"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("yes")}</SelectItem>
                      <SelectItem value="no">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("status")}</FieldLabel>
                  <StudentStatusSelector
                    defaultValue={field.state.value}
                    onChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="formerSchoolId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel htmlFor="formerSchoolId">
                    {t("formerSchool")}
                  </FieldLabel>
                  <FormerSchoolSelector
                    className="w-full"
                    defaultValue={field.state.value}
                    onChange={(value) => {
                      field.handleChange(value ?? "");
                    }}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="dateOfEntry"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("dateOfEntry")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="dateOfExit"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("dateOfExit")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </CardContent>
      </Card>
    </form>
  );
}
