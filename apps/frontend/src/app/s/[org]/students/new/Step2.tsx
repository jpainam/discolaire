/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParams } from "next/navigation";
import { Building } from "lucide-react";
import { useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { DatePicker } from "~/components/DatePicker";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";

export function Step2() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const form = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Academic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="gird-cols-1 grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("classroom")}</FormLabel>
              <FormControl>
                <ClassroomSelector className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("status")}</FormLabel>
              <FormControl>
                <StudentStatusSelector defaultValue={field.value} {...field} />
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
      </CardContent>
    </Card>
  );
}
