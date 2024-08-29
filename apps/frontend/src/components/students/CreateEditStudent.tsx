"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import type { Tag } from "@repo/ui/TagInput/tag-input";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { PhoneInput } from "@repo/ui/phone-input";
import { Separator } from "@repo/ui/separator";
import { TagInput } from "@repo/ui/TagInput/index";
import { Textarea } from "@repo/ui/textarea";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { SelectField } from "~/components/shared/forms/SelectField";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { env } from "~/env";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

interface ProfileCreateEditSheetProps {
  student?:
    | RouterOutputs["student"]["get"]
    | RouterOutputs["student"]["all"][number];
}

const createEditStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().optional(),
  countryId: z.string(),
  dateOfEntry: z.coerce.date().optional().or(z.literal("")),
  dateOfExit: z.coerce.date().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  observation: z.string().optional(),
});

export default function CreateEditStudent({
  student,
}: ProfileCreateEditSheetProps) {
  const { closeSheet } = useSheet();
  const { t } = useLocale();
  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof createEditStudentSchema>>({
    defaultValues: {
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      dateOfBirth: student?.dateOfBirth ?? new Date(),
      placeOfBirth: student?.placeOfBirth ?? "",
      gender: student?.gender ?? "",
      residence: student?.residence ?? "",
      phoneNumber: student?.phoneNumber ?? "",
      email: student?.email ?? "",
      countryId: student?.countryId ?? env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE,
      dateOfExit: student?.dateOfExit ?? "",
      dateOfEntry: student?.dateOfEntry ?? "",
      formerSchoolId: student?.formerSchoolId ?? "",
      observation: student?.observation ?? "",
      // @ts-expect-error TODO  fix this
      tags: student?.tags ?? [],
    },
    resolver: zodResolver(createEditStudentSchema),
  });

  const createStudentMutation = api.student.create.useMutation({
    onSettled: () => utils.student.all.invalidate(),
  });
  const updateStudentMutation = api.student.update.useMutation({
    onSettled: () => utils.student.get.invalidate(student?.id),
  });
  const utils = api.useUtils();
  const onSubmit = (data: z.infer<typeof createEditStudentSchema>) => {
    const values = {
      ...data,
      dateOfEntry: data.dateOfEntry ? data.dateOfEntry : undefined,
      formerSchoolId: data.formerSchoolId ? data.formerSchoolId : undefined,
      dateOfExit: data.dateOfExit ? data.dateOfExit : undefined,
    };
    if (student?.id) {
      toast.promise(
        updateStudentMutation.mutateAsync({ id: student.id, ...values }),
        {
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
          success: () => {
            closeSheet();
            return t("updated_successfully");
          },
        },
      );
    } else {
      toast.promise(createStudentMutation.mutateAsync(values), {
        loading: t("creating"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: () => {
          closeSheet();
          return t("created_successfully");
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={"max-h-[80vh] overflow-y-auto"}>
          <div className={"grid grid-cols-2 gap-2 p-2"}>
            <InputField
              name="lastName"
              placeholder={t("lastName")}
              label={t("lastName")}
            />
            <InputField
              name="firstName"
              placeholder={t("firstName")}
              label={t("firstName")}
            />

            <DatePickerField
              placeholder={t("dateOfBirth")}
              name="dateOfBirth"
              label={t("dateOfBirth")}
            />
            <InputField
              name="placeOfBirth"
              placeholder={t("placeOfBirth")}
              label={t("placeOfBirth")}
            />
            <SelectField
              name="gender"
              label={t("gender")}
              placeholder={t("gender")}
              items={genders}
            />
            <InputField
              className="gap-2"
              name="residence"
              placeholder="Résidence"
              label="Résidence"
            />
          </div>
          <Separator className="my-2" />
          <div className={"grid grid-cols-2 gap-2 p-2"}>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    {t("phoneNumber")}
                  </FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <InputField name="email" placeholder="Email" label="Email" />

            <FormField
              control={form.control}
              name="formerSchoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="formerSchoolId">
                    {t("formerSchool")}
                  </FormLabel>
                  <FormControl>
                    <FormerSchoolSelector
                      placeholder={t("formerSchool")}
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
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="countryId">{t("citizenship")}</FormLabel>
                  <FormControl>
                    <CountryPicker
                      placeholder={t("citizenship")}
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DatePickerField
              placeholder={t("dateOfEntry")}
              name="dateOfEntry"
              label={t("dateOfEntry")}
            />
            <DatePickerField name="dateOfExit" label={t("dateOfExit")} />
          </div>
          <Separator className="my-2" />
          <div className="p-2">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <TagInput
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                  {...field}
                  placeholder={t("enter_tags")}
                  tags={tags}
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
          </div>
        </div>
        <div className="mx-4 flex items-center justify-end gap-4">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{student ? t("edit") : t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
