/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type { Country } from "react-phone-number-input";
import { PiCalendarDotsDuotone } from "react-icons/pi";

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
import { PhoneInput } from "~/components/phone-input";
import { CountryPicker } from "~/components/shared/CountryPicker";
import { InputField } from "~/components/shared/forms/input-field";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";

export function CreateUpdateAddress() {
  const { t } = useLocale();
  const form = useFormContext();
  const { school } = useSchool();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <PiCalendarDotsDuotone className="h-6 w-6" />
            {t("date")}/{t("information")}
          </div>
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            {school.requestSunPlusNo && (
              <InputField
                name="sunPlusNo"
                className="flex-1"
                placeholder={t("sun_plus_no")}
                label={t("sun_plus_no")}
              />
            )}
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
                  <FormLabel htmlFor="formerSchoolId">
                    {t("formerSchool")}
                  </FormLabel>
                  <FormControl>
                    <FormerSchoolSelector
                      className="w-full"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem className="flex-1">
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

            <FormField
              control={form.control}
              name="dateOfEntry"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("dateOfEntry")}</FormLabel>
                  <FormControl>
                    <DatePicker defaultValue={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="dateOfExit"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("dateOfExit")}</FormLabel>
                  <FormControl>
                    <DatePicker defaultValue={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
