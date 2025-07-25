/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivitySquare } from "lucide-react";

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

import type { Option } from "~/components/multiselect";
import MultipleSelector from "~/components/multiselect";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function CreateUpdateExtra() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const clubsQuery = useQuery(trpc.setting.clubs.queryOptions());
  const sportsQuery = useQuery(trpc.setting.sports.queryOptions());
  const sportOptions: Option[] = sportsQuery.data
    ? sportsQuery.data.map((sport) => ({
        label: sport.name,
        value: sport.id,
      }))
    : [];

  const clubOptions: Option[] = clubsQuery.data
    ? clubsQuery.data.map((club) => ({
        label: club.name,
        value: club.id,
      }))
    : [];

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
      {sportsQuery.isPending ||
        (clubsQuery.isPending && (
          <div className="py">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        ))}
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
                    {sportsQuery.isPending ? (
                      <Skeleton className="h-8 w-full" />
                    ) : (
                      <MultipleSelector
                        commandProps={{
                          label: t("select_options"),
                        }}
                        value={field.value}
                        defaultOptions={sportOptions}
                        //options={sportOptions}
                        onChange={(values) => {
                          field.onChange(values);
                        }}
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-sm">
                            {t("no_results")}
                          </p>
                        }
                      />
                    )}
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
                    {clubsQuery.isPending ? (
                      <Skeleton className="h-8 w-full" />
                    ) : (
                      <MultipleSelector
                        commandProps={{
                          label: t("select_options"),
                        }}
                        value={field.value}
                        defaultOptions={clubOptions}
                        //options={clubOptions}
                        onChange={(values) => {
                          field.onChange(values);
                        }}
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-sm">
                            {t("no_results")}
                          </p>
                        }
                      />
                    )}
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
