"use client";

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
import MultipleSelector from "@repo/ui/multiple-selector";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { api } from "~/trpc/react";

export function CreateUpdateDenom() {
  const { t } = useLocale();
  const form = useFormContext();
  const financeGroupQuery = api.accounting.groups.useQuery();

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
        <FormField
          control={form.control}
          name="applicableFees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frais appliqués</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  options={financeGroupQuery.data?.map((g) => {
                    return { label: g.name, value: g.id };
                  })} // using 'options' instead of 'defaultOptions' because they have an async source and I'm not early returning a loading state while waiting for fetching to finish
                  hidePlaceholderWhenSelected
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
