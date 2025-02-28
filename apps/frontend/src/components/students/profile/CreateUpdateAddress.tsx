/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { PiCalendarDotsDuotone } from "react-icons/pi";
import type { Country } from "react-phone-number-input";

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
import { PhoneInput } from "~/components/phone-input";
import { useLocale } from "~/i18n";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { useSchool } from "~/providers/SchoolProvider";

export function CreateUpdateAddress() {
  const { t } = useLocale();
  const form = useFormContext();
  const { school } = useSchool();

  return (
    <Card className="rounded-md py-0 gap-0">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <PiCalendarDotsDuotone className="h-4 w-4" />
          {t("date")}/{t("information")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 py-4 gap-x-4 gap-y-2 md:grid-cols-2">
        {school.requestSunPlusNo && (
          <InputField
            name="sunPlusNo"
            placeholder={t("sun_plus_no")}
            label={t("sun_plus_no")}
          />
        )}
        <InputField name="email" placeholder="Email" label="Email" />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="Placeholder"
                  {...field}
                  defaultCountry={school.defaultCountryId as Country}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formerSchoolId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel htmlFor="formerSchoolId">
                {t("formerSchool")}
              </FormLabel>
              <FormControl>
                <FormerSchoolSelector
                  placeholder={t("formerSchool")}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel htmlFor="countryId">{t("citizenship")}</FormLabel>
              <FormControl>
                <CountryPicker
                  placeholder={t("citizenship")}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DatePickerField
          placeholder={t("dateOfEntry")}
          name="dateOfEntry"
          label={t("dateOfEntry")}
        />
        <DatePickerField name="dateOfExit" label={t("dateOfExit")} />
      </CardContent>
    </Card>
  );
}
