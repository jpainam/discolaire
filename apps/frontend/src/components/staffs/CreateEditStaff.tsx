"use client";

import { subMonths } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";
import { DatePickerField } from "../shared/forms/date-picker-field";
import { InputField } from "../shared/forms/input-field";
import { SelectField } from "../shared/forms/SelectField";
import { StaffLevelSelector } from "../shared/selects/StaffLevelSelector";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"][number]>;

const staffCreateEditSchema = z.object({
  prefix: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["female", "male"]).default("male"),
  isActive: z.coerce.boolean().default(true),
  jobTitle: z.string().min(1),
  countryId: z.string().min(1),
  observation: z.string().optional(),
  degreeId: z.string().optional(),
  employmentType: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber1: z.string().min(1),
  phoneNumber2: z.string().optional(),
  dateOfHire: z.coerce.date().optional(),
  dateOfRelease: z.coerce.date().optional(),
  dateOfCriminalRecordCheck: z.coerce.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  dateOfLastAdvancement: z.coerce.date().optional(),
  isTeacher: z.string().default("yes"),
  dateOfBirth: z.coerce.date().optional(),
});
interface CreateEditStaffProps {
  staff?: StaffProcedureOutput;
}

export function CreateEditStaff({ staff }: CreateEditStaffProps) {
  const { closeSheet } = useSheet();
  const classNames = {
    // inputClassName: "h-8",
    labelClassName: "w-[150px] truncate",
    className: "flex flex-row items-center px-2",
  };
  const form = useForm({
    schema: staffCreateEditSchema,
    defaultValues: {
      prefix: staff?.prefix ?? "",
      firstName: staff?.firstName ?? "",
      lastName: staff?.lastName ?? "",
      gender: staff?.gender ?? "male",
      isActive: staff?.isActive ?? true,
      jobTitle: staff?.jobTitle ?? "",
      countryId: staff?.countryId ?? "",
      observation: staff?.observation ?? "",
      degreeId: staff ? String(staff.degreeId) : "",
      employmentType: staff?.employmentType ?? "",
      address: staff?.address ?? "",
      email: staff?.email ?? "",
      phoneNumber1: staff?.phoneNumber1 ?? "",
      phoneNumber2: staff?.phoneNumber2 ?? "",
      dateOfHire: staff?.dateOfHire ?? new Date(),
      dateOfRelease: staff?.dateOfRelease ?? new Date(),
      dateOfCriminalRecordCheck: staff?.dateOfCriminalRecordCheck ?? new Date(),
      sendAgendaFrequency: staff?.sendAgendaFrequency ?? "",
      dateOfLastAdvancement: staff?.dateOfLastAdvancement ?? new Date(),
      isTeacher: staff?.isActive ? "yes" : "no",
      dateOfBirth: staff?.dateOfBirth ?? subMonths(new Date(), 100),
    },
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  const createStaffMutation = api.staff.create.useMutation({
    onSettled: async () => {
      await utils.staff.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeSheet();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateStaffMutation = api.staff.update.useMutation({
    onSettled: async () => {
      await utils.staff.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeSheet();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const onSubmit = (data: z.infer<typeof staffCreateEditSchema>) => {
    const values = {
      prefix: data.prefix,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      isActive: data.isActive,
      jobTitle: data.jobTitle,
      countryId: data.countryId,
      observation: data.observation,
      degreeId: data.degreeId ? parseInt(data.degreeId) : undefined,
      employmentType: data.employmentType,
      address: data.address,
      email: data.email,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      dateOfHire: data.dateOfHire,
      dateOfRelease: data.dateOfRelease,
      dateOfCriminalRecordCheck: data.dateOfCriminalRecordCheck,
      sendAgendaFrequency: data.sendAgendaFrequency,
      dateOfLastAdvancement: data.dateOfLastAdvancement,
      isTeacher: data.isTeacher == "yes" ? true : false,
      dateOfBirth: data.dateOfBirth,
    };
    if (staff) {
      toast.loading(t("updating"), { id: 0 });
      updateStaffMutation.mutate({ id: staff.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createStaffMutation.mutate(values);
    }
  };

  const isTeacherItems = [
    { label: t("yes"), value: "yes" },
    { label: t("no"), value: "no" },
  ];
  const sendAgendaFrequency = [
    { label: t("no"), value: "no" },
    { label: t("daily"), value: "daily" },
    { label: t("weekly"), value: "weekly" },
    { label: t("monthly"), value: "monthly" },
    { label: t("quarterly"), value: "quarterly" },
    { label: t("yearly"), value: "yearly" },
  ];
  const employmentTypeItems = [
    { label: t("fullTime"), value: "fullTime" },
    { label: t("partTime"), value: "partTime" },
    { label: t("contract"), value: "contract" },
  ];
  const prefixes = [
    { label: t("Mr"), value: "mr" },
    { label: t("Mrs"), value: "mrs" },
    { label: t("Miss"), value: "miss" },
    { label: t("Dr"), value: "dr" },
  ];

  return (
    <Form {...form}>
      <form className="h-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className={"grid max-h-[85vh] grid-cols-2 overflow-y-auto py-4"}>
          <SelectField
            label={t("civility")}
            {...classNames}
            name="prefix"
            items={prefixes}
          />
          <InputField name="lastName" {...classNames} label={t("lastName")} />
          <InputField name="firstName" {...classNames} label={t("firstName")} />
          <InputField name="email" {...classNames} label={t("email")} />
          <Separator className="col-span-full my-8" />
          <InputField
            name="phoneNumber1"
            {...classNames}
            label={`${t("phone")} 1`}
          />
          <InputField
            name="phoneNumber2"
            {...classNames}
            label={`${t("phone")} 2`}
          />
          <InputField
            name="address"
            {...classNames}
            className="col-span-full px-2"
            label={t("address")}
          />
          <Separator className="col-span-full my-4" />
          <SelectField
            label={t("employmentType")}
            inputClassName="h-8"
            className="mx-2"
            items={employmentTypeItems}
            name="employmentType"
          />
          <FormField
            control={form.control}
            name={"degreeId"}
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>{t("degree")}</FormLabel>
                <FormControl>
                  <StaffLevelSelector
                    className="w-full"
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={staff?.degreeId?.toString() ?? undefined}
                    onSelectCreateLevel={() => console.log("create level")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-full my-4" />
          <DatePickerField
            inputClassName="h-8"
            className="mx-2"
            name={"dateOfBirth"}
            label={t("dateOfBirth")}
          />
          <DatePickerField
            className="mx-2"
            inputClassName="h-8"
            name={"dateOfHire"}
            label={t("dateOfHire")}
          />
          <DatePickerField
            className="mx-2 mt-4"
            inputClassName="h-8"
            name={"dateOfLastAdvancement"}
            label={t("dateOfLastAdvancement")}
          />
          <DatePickerField
            className="mx-2 mt-4"
            inputClassName="h-8"
            name={"dateOfCriminalRecordCheck"}
            label={t("lastCriminalRecordCheck")}
          />
          <Separator className="col-span-full my-4" />
          <SelectField
            label={t("sendAgenda")}
            inputClassName="h-8"
            className="mx-2"
            items={sendAgendaFrequency}
            name="sendAgendaFrequency"
          />
          <SelectField
            label={t("isTeacher")}
            inputClassName="h-8"
            className="mx-2"
            items={isTeacherItems}
            name="isTeacher"
          />
          <Separator className="col-span-full my-4" />
          <div className="col-span-full mx-2 flex flex-col gap-2">
            <FormField
              control={form.control}
              name={"observation"}
              render={({ field }) => (
                <FormItem className="mx-2">
                  <FormLabel>{t("observations")}</FormLabel>
                  <FormControl>
                    <Textarea
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      className="h-24 rounded-md border p-2"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="m-4 flex items-center justify-end gap-4">
          <Button
            className="h-8 w-auto"
            variant={"outline"}
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button className="h-8 w-auto" size={"sm"} type="submit">
            {staff ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
