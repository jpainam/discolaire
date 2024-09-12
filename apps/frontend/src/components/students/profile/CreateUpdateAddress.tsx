"use client";

import { z } from "zod";

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
import { PhoneInput } from "@repo/ui/phone-input";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { env } from "~/env";

const createEditSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().optional(),
  countryId: z.string(),
  dateOfEntry: z.coerce.date().optional().or(z.literal("")),
  dateOfExit: z.coerce.date().optional().or(z.literal("")),
});

export function CreateUpdateAddress({
  phoneNumber,
  email,
  countryId,
  dateOfExit,
  dateOfEntry,
  formerSchoolId,
}: {
  phoneNumber?: string;
  email?: string;
  countryId?: string;
  dateOfExit?: Date;
  dateOfEntry?: Date;
  formerSchoolId?: string;
}) {
  const { t } = useLocale();
  const form = useForm({
    schema: createEditSchema,
    defaultValues: {
      phoneNumber: phoneNumber ?? "",
      email: email ?? "",
      countryId: countryId ?? env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE,
      dateOfExit: dateOfExit ?? "",
      dateOfEntry: dateOfEntry ?? "",
      formerSchoolId: formerSchoolId ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof createEditSchema>) => {
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
            <InputField name="email" placeholder="Email" label="Email" />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-col items-start space-y-0">
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

            <FormField
              control={form.control}
              name="formerSchoolId"
              render={({ field }) => (
                <FormItem className="space-y-0">
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
                <FormItem className="space-y-0">
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
