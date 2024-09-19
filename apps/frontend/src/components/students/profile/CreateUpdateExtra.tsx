"use client";

import { useState } from "react";
import { LuActivitySquare } from "react-icons/lu";
import { toast } from "sonner";

import type { Option } from "@repo/ui/multiple-selector";
import type { Tag } from "@repo/ui/TagInput/tag-input";
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
import { Skeleton } from "@repo/ui/skeleton";
import { TagInput } from "@repo/ui/TagInput/index";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

export function CreateUpdateExtra() {
  const { t } = useLocale();
  const clubsQuery = api.setting.clubs.useQuery();
  const [_tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
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
    <Card className="rounded-md">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="flex items-center gap-1 text-sm">
          <LuActivitySquare className="h-4 w-4" />
          {t("extra_activities")}
        </CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sportsQuery.isPending || clubsQuery.isPending ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="sports"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <TagInput
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                  {...field}
                  placeholder={t("enter_tags")}
                  tags={_tags}
                  setTags={(newTags) => {
                    setTags(newTags);
                    form.setValue(
                      "tags",
                      (newTags as Tag[]).map((tag) => tag.text),
                    );
                  }}
                />
              )}
            />
            <FormField
              control={form.control}
              name={"observation"}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel htmlFor="observation">
                    {t("observation")}
                  </FormLabel>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
