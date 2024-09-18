"use client";

import { PiCalendarDotsDuotone } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/form";
import { PhoneInput } from "@repo/ui/phone-input";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";

export function CreateUpdateAddress() {
  const { t } = useLocale();
  const form = useFormContext();

  return (
    <Card className="rounded-md">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <PiCalendarDotsDuotone className="h-4 w-4" />
          {t("date")}/{t("address")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField name="email" placeholder="Email" label="Email" />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-col items-start space-y-0">
              <FormLabel className="text-left">{t("phoneNumber")}</FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="Enter a phone number" {...field} />
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
