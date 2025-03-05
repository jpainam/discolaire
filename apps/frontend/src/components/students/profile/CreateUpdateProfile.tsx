/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { PiAddressBookTabsDuotone } from "react-icons/pi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/components/form";
import { DatePicker } from "~/components/DatePicker";
import { InputField } from "~/components/shared/forms/input-field";
import { SelectField } from "~/components/shared/forms/SelectField";
import { useLocale } from "~/i18n";

export function CreateUpdateProfile() {
  const { t } = useLocale();

  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  const form = useFormContext();

  return (
    <Card className="rounded-md p-0 gap-0">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <PiAddressBookTabsDuotone className="h-4 w-4" />
          {t("information")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-4 gap-y-2 py-4 md:grid-cols-2">
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
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dateOfBirth")}</FormLabel>
              <FormControl>
                <DatePicker defaultValue={field.value} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
