/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useTranslations } from "next-intl";
import { LiaDumbbellSolid } from "react-icons/lia";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function CreateUpdateDenom() {
  const t = useTranslations();
  const form = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <div className="flex items-center gap-2">
            <LiaDumbbellSolid className="h-6 w-6" />
            {t("membership")}
          </div>
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="religionId"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
                  <FormLabel>{t("baptized")} ?</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value ? "yes" : "no"}
                      onValueChange={(val) => {
                        field.onChange(val === "yes");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("baptized")} />
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
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="isRepeating"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("repeating")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
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
                <FormItem className="flex-1">
                  <FormLabel>{t("is_new")} ?</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val === "yes");
                      }}
                      defaultValue={field.value ? "yes" : "no"}
                    >
                      <SelectTrigger className="w-full">
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
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            {!form.getValues("id") && (
              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("classroom")}</FormLabel>
                    <FormControl>
                      <ClassroomSelector
                        onSelect={field.onChange}
                        defaultValue={field.value}
                        className="w-full"
                        {...field}
                      />
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
                <FormItem className="flex-1">
                  <FormLabel>{t("status")}</FormLabel>
                  <FormControl>
                    <StudentStatusSelector
                      defaultValue={field.value}
                      {...field}
                    />
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
