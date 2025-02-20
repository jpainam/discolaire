"use client";

import { PiAddressBookTabsDuotone } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

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
        <CardTitle className="flex items-center gap-1 text-sm">
          <PiAddressBookTabsDuotone className="h-4 w-4" />
          {t("information")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
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
        {/* <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>
                {t("dateOfBirth")}
                {field.value.toString()}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder={t("placeOfBirth")}
                  {...field}
                  defaultValue={new Date(field.value).toString()}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        <DatePickerField
          placeholder={t("dateOfBirth")}
          name="dateOfBirth"
          timeZone="UTC"
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
          placeholder={t("address")}
          label={t("address")}
        />
        <InputField
          className="gap-2"
          name="registrationNumber"
          placeholder={t("registrationNumber")}
          label={t("registrationNumber")}
        />
      </CardContent>
    </Card>
  );
}
