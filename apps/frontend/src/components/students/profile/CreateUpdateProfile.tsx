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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <div className="flex items-center gap-2">
            <PiAddressBookTabsDuotone className="h-6 w-6" />
            {t("information")}
          </div>
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <InputField
              className="flex-1"
              name="lastName"
              placeholder={t("lastName")}
              label={t("lastName")}
            />
            <InputField
              className="flex-1"
              name="firstName"
              placeholder={t("firstName")}
              label={t("firstName")}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("dateOfBirth")}</FormLabel>
                  <FormControl>
                    <DatePicker defaultValue={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InputField
              className="flex-1"
              name="placeOfBirth"
              placeholder={t("placeOfBirth")}
              label={t("placeOfBirth")}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <SelectField
              name="gender"
              inputClassName="w-[150px]"
              label={t("gender")}
              placeholder={t("gender")}
              items={genders}
            />
            <InputField
              className="flex-1"
              name="residence"
              placeholder={t("address")}
              label={t("address")}
            />
          </div>
          <InputField
            className="gap-2"
            name="registrationNumber"
            placeholder={t("registrationNumber")}
            label={t("registrationNumber")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
