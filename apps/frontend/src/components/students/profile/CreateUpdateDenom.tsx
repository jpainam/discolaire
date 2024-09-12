"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Form, useForm } from "@repo/ui/form";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { SelectField } from "~/components/shared/forms/SelectField";
import { api } from "~/trpc/react";

const createEditSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.string().min(1),
  residence: z.string().optional(),
});

export function CreateUpdateDenom({
  id,
  firstName,
  lastName,
  placeOfBirth,
  dateOfBirth,
  residence,
  gender,
}: {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  residence?: string;
  gender?: string;
  placeOfBirth?: string;
}) {
  const { t } = useLocale();
  const form = useForm({
    schema: createEditSchema,
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      dateOfBirth: dateOfBirth ?? new Date(),
      placeOfBirth: placeOfBirth ?? "",
      gender: gender ?? "",
      residence: residence ?? "",
    },
  });
  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  const createStudentMutation = api.student.create.useMutation({
    onSettled: () => utils.student.all.invalidate(),
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateStudentMutation = api.student.update.useMutation({
    onSettled: () => utils.student.get.invalidate(id),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });
  const utils = api.useUtils();

  const onSubmit = (data: z.infer<typeof createEditSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateStudentMutation.mutate({ id, ...data });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createStudentMutation.mutate(data);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="rounded-md">
          <CardHeader className="border-b bg-muted/50 py-2.5">
            <CardTitle className="text-sm">{t("information")}</CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              name="lastName"
              placeholder={t("lastName")}
              label={t("lastName")}
            />
            <InputField
              name="firstName"
              placeholder={t("firstName")}
              label={t("firstName")}
            />

            <DatePickerField
              placeholder={t("dateOfBirth")}
              name="dateOfBirth"
              label={t("dateOfBirth")}
            />
            <InputField
              name="placeOfBirth"
              placeholder={t("placeOfBirth")}
              label={t("placeOfBirth")}
            />
            <SelectField
              name="gender"
              label={t("gender")}
              placeholder={t("gender")}
              items={genders}
            />
            <InputField
              className="gap-2"
              name="residence"
              placeholder="Résidence"
              label="Résidence"
            />
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t bg-muted/50 py-2">
            <Button
              size={"sm"}
              disabled={!form.formState.isDirty}
              type="submit"
            >
              {t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
