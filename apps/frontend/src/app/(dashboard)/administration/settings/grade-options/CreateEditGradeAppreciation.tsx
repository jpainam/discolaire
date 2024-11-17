"use client";

import { SaveIcon, XIcon } from "lucide-react";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import type { Option } from "@repo/ui/multiple-selector";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import MultipleSelector from "@repo/ui/multiple-selector";

const createEditAppreciationSchema = z.object({
  min: z.number().int().min(0),
  max: z.number().int().min(0),
  appreciation: z.string().min(1),
  classroomIds: z.array(z.string().min(1)).default([]),
});
export function CreateEditGradeAppreciation({
  classrooms,
}: {
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const form = useForm({
    schema: createEditAppreciationSchema,
    defaultValues: {
      min: 0,
      max: 0,
      appreciation: "",
      classroomIds: [],
    },
  });

  const classroomsOptions: Option<string>[] = classrooms.map((cl) => ({
    label: cl.name,
    value: cl.id,
  }));
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof createEditAppreciationSchema>) => {
    console.log(data);
  };
  const { t } = useLocale();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="gap4 grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("min_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("max_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="appreciation"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("appreciation")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classroomIds"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("classrooms")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={
                    form.getValues(
                      "classroomIds",
                    ) as unknown as Option<string>[]
                  }
                  options={classroomsOptions}
                  hidePlaceholderWhenSelected
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-end gap-4">
          <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
          >
            <XIcon className="mr-2 size-4" />
            {t("cancel")}
          </Button>
          <Button type="submit" size={"sm"}>
            <SaveIcon className="mr-2 size-4" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
