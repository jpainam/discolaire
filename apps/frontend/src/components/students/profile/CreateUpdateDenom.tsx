/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { LiaDumbbellSolid } from "react-icons/lia";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useLocale } from "~/i18n";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";

export function CreateUpdateDenom() {
  const { t } = useLocale();
  const form = useFormContext();

  return (
    <Card className="rounded-md py-0">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          {/* <PiChurchDuotone className="h-4 w-4" /> */}
          <LiaDumbbellSolid className="h-4 w-4" />
          {t("membership")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
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
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="isRepeating"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("repeating")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("yes")}</SelectItem>
                      <SelectItem value="no">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("is_new")} ?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {!form.getValues("id") && (
          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("classroom")}</FormLabel>
                <FormControl>
                  <ClassroomSelector className="w-full" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
      </CardContent>
    </Card>
  );
}
