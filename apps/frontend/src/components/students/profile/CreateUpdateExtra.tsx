/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { ActivitySquare } from "lucide-react";
import { toast } from "sonner";

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
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";
import type { Option } from "~/components/students/multiple-selector";
import MultipleSelector from "~/components/students/multiple-selector";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";

export function CreateUpdateExtra() {
  const { t } = useLocale();
  const clubsQuery = api.setting.clubs.useQuery();
  const sportsQuery = api.setting.sports.useQuery();
  const sportOptions: Option<string>[] = sportsQuery.data
    ? sportsQuery.data.map((sport) => ({
        label: sport.name,
        value: sport.id,
      }))
    : [];

  const clubOptions: Option<string>[] = clubsQuery.data
    ? clubsQuery.data.map((club) => ({
        label: club.name,
        value: club.id,
      }))
    : [];

  const form = useFormContext();

  if (sportsQuery.error || clubsQuery.error) {
    toast.error(sportsQuery.error?.message ?? clubsQuery.error?.message);
    return;
  }

  return (
    <Card className="rounded-md py-0 gap-0">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <ActivitySquare className="h-4 w-4" />
          {t("extra_activities")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      {sportsQuery.isPending ||
        (clubsQuery.isPending && (
          <div className="py">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        ))}
      <CardContent className="grid grid-cols-1 py-4 gap-x-4 gap-y-2 md:grid-cols-2">
        <FormField
          control={form.control}
          name="sports"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("sports")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={form.getValues("sports")}
                  options={sportOptions}
                  hidePlaceholderWhenSelected
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
            <FormItem className="space-y-0">
              <FormLabel>{t("clubs")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={form.getValues("clubs")}
                  options={clubOptions}
                  hidePlaceholderWhenSelected
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </CardContent>
    </Card>
  );
}
