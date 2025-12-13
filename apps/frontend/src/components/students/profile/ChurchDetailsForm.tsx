"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { DatePicker } from "~/components/DatePicker";
import { InputField } from "~/components/shared/forms/input-field";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";

export function ChurchDetailsForm() {
  const t = useTranslations();
  const schema = z.object({
    churchFamily: z.string().min(1),
    pastorName: z.string().optional(),
    religion: z.string().min(1),
    churchAttendanceFrequency: z.string().min(1),
    isChurchMember: z.boolean().optional(),
    isBaptized: z.boolean().optional(),
    dateOfBaptism: z.date().optional(),
  });
  type FormValues = z.infer<typeof schema>;
  const form = useForm({
    defaultValues: {
      churchFamily: "",
      pastorName: "",
      religion: "",
      churchAttendanceFrequency: "",
      isChurchMember: false,
      isBaptized: false,
      dateOfBaptism: new Date(),
    },
    resolver: standardSchemaResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };
  const { closeModal } = useModal();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-2">
          <InputField
            inputClassName="h-8"
            name="churchFamily"
            label={t("church_family_attends")}
          />
          <InputField
            inputClassName="h-8"
            name="pastorName"
            label={t("name_of_pastor")}
          />
          <InputField
            inputClassName="h-8"
            name="religion"
            label={t("religion")}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-3">
          <InputField
            inputClassName="h-8"
            name="churchAttendanceFrequency"
            label={t("how_often_do_you_attend") + "?"}
          />
          <FormField
            control={form.control}
            name="isChurchMember"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>{t("are_you_a_member")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    // defaultValue={!!field.value}
                    className="flex flex-row gap-4"
                  >
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("yes")}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="0" />
                      </FormControl>
                      <FormLabel className="font-normal">{t("no")}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <fieldset className="border px-2">
          <legend className="font-bold">{t("baptism")}</legend>
          <div className="flex flex-row gap-4 pb-2">
            <FormField
              control={form.control}
              name="isChurchMember"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("has_the_student_been_baptized")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      // defaultValue={!!field.value}
                      className="flex flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("yes")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="0" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("no")}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBaptism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("date_of_baptism")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      defaultValue={field.value}
                      onSelectAction={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <div className="my-4 flex flex-row justify-end gap-4">
          <Button
            type="button"
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
