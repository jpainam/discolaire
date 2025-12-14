/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useTranslations } from "next-intl";
import { PiAddressBookTabsDuotone } from "react-icons/pi";

import { DatePicker } from "~/components/DatePicker";
import { InputField } from "~/components/shared/forms/input-field";
import { SelectField } from "~/components/shared/forms/SelectField";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "~/components/ui/form";

export function CreateUpdateProfile() {
  const t = useTranslations();

  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  const form = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <PiAddressBookTabsDuotone />
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
                    <DatePicker
                      defaultValue={field.value}
                      onSelectAction={field.onChange}
                    />
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
