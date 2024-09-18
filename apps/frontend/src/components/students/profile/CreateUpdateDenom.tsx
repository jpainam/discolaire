"use client";

import { PiChurchDuotone } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/form";

import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";

export function CreateUpdateDenom() {
  const { t } = useLocale();
  const form = useFormContext();

  return (
    <Card className="rounded-md">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <PiChurchDuotone className="h-4 w-4" />
          {t("religion")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="religionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("religion")}</FormLabel>
              <FormControl>
                <ReligionSelector {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isBaptized"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("baptized")} ?</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
