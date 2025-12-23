"use client";

import { ActivitySquare } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClubMultiSelector } from "~/components/shared/selects/ClubMultiSelector";
import { SportMultiSelector } from "~/components/shared/selects/SportMultiSelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

export function CreateUpdateExtra() {
  const t = useTranslations();

  const form = useFormContext();

  return (
    <Card>
      <CardHeader className="text-lg">
        <CardTitle>
          <div className="flex items-center gap-2">
            <ActivitySquare className="h-6 w-6" />
            {t("extra_activities")}
          </div>
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <FormField
              control={form.control}
              name="sports"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("sports")}</FormLabel>
                  <FormControl>
                    <SportMultiSelector
                      onChangeAction={(values) => field.onChange(values)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clubs"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("clubs")}</FormLabel>
                  <FormControl>
                    <ClubMultiSelector
                      onChangeAction={(values) => field.onChange(values)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <Textarea {...field} placeholder={t("enter_tags")} />
              )}
            /> */}
          <FormField
            control={form.control}
            name={"observation"}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel htmlFor="observation">{t("observation")}</FormLabel>
                <FormControl>
                  <Textarea
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
