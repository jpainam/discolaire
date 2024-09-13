"use client";

import { useLocale } from "@repo/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { SelectField } from "~/components/shared/forms/SelectField";

export function CreateUpdateProfile() {
  const { t } = useLocale();

  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  return (
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
    </Card>
  );
}
