"use client";

import { LiaDumbbellSolid } from "react-icons/lia";

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

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";

export function CreateUpdateDenom() {
  const { t } = useLocale();
  const form = useFormContext();

  return (
    <Card className="rounded-md">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          {/* <PiChurchDuotone className="h-4 w-4" /> */}
          <LiaDumbbellSolid className="h-4 w-4" />
          {t("membership")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="religionId"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("religion")}</FormLabel>
                <FormControl>
                  <ReligionSelector defaultValue={field.value} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isBaptized"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("status")}</FormLabel>
              <FormControl>
                <StudentStatusSelector defaultValue={field.value} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {!form.getValues("id") && (
          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("classroom")}</FormLabel>
                <FormControl>
                  <ClassroomSelector {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
