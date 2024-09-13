"use client";

import { useState } from "react";

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
import { TagInput } from "@repo/ui/TagInput/index";
import { Textarea } from "@repo/ui/textarea";

export function CreateUpdateExtra() {
  const { t } = useLocale();
  const [_tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const form = useFormContext();

  return (
    <Card className="rounded-md">
      <CardHeader className="border-b bg-muted/50 py-2.5">
        <CardTitle className="text-sm">{t("information")}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <FormItem>
              <FormLabel htmlFor="formerSchoolId">{t("observation")}</FormLabel>
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
