"use client";

import { useState } from "react";
import { z } from "zod";

import type { Tag } from "@repo/ui/TagInput/tag-input";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { TagInput } from "@repo/ui/TagInput/index";
import { Textarea } from "@repo/ui/textarea";

const createEditSchema = z.object({
  tags: z.array(z.string()).optional(),
  observation: z.string().optional(),
});

export function CreateUpdateExtra({
  observation,
  id,
  tags,
}: {
  observation: string;
  id?: string;
  tags: string[];
}) {
  const { t } = useLocale();
  const [_tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const form = useForm({
    schema: createEditSchema,
    defaultValues: {
      observation: observation,
      tags: tags,
    },
  });

  const onSubmit = (data: z.infer<typeof createEditSchema>) => {
    if (id) {
      console.log("");
    } else {
      console.log("");
    }
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormLabel htmlFor="formerSchoolId">
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
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t bg-muted/50 py-2">
            <Button
              size={"sm"}
              disabled={!form.formState.isDirty}
              type="submit"
            >
              {t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
