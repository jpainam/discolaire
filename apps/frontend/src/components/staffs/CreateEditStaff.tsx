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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";
import { CountryPicker } from "../shared/CountryPicker";
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
  jobTitle: z.string().optional(),
  countryId: z.string().optional(),
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
      degreeId: data.degreeId
        ? !Number.isNaN(parseInt(data.degreeId, 10))
          ? parseInt(data.degreeId, 10)
          : undefined
        : undefined,
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
        <div
          className={
            "grid max-h-[85vh] grid-cols-2 gap-x-8 gap-y-2 overflow-y-auto p-2"
          }
        >
          <SelectField label={t("civility")} name="prefix" items={prefixes} />
          <InputField name="lastName" label={t("lastName")} />
          <InputField name="firstName" label={t("firstName")} />
          <InputField name="email" label={t("email")} />

          <InputField name="phoneNumber1" label={`${t("phone")} 1`} />
          <InputField name="phoneNumber2" label={`${t("phone")} 2`} />
          <InputField name="jobTitle" label={t("jobTitle")} />
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

          <InputField
            name="address"
            {...classNames}
            className="col-span-full px-2"
            label={t("address")}
          />
          <div className="col-span-full grid w-full grid-cols-2 gap-2 gap-x-8">
            <SelectField
              label={t("employmentType")}
              items={employmentTypeItems}
              name="employmentType"
            />
            <FormField
              control={form.control}
              name={"degreeId"}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("degree")}</FormLabel>
                  <FormControl>
                    <StaffLevelSelector
                      className="w-full"
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={staff?.degreeId?.toString() ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DatePickerField name={"dateOfBirth"} label={t("dateOfBirth")} />
            <DatePickerField name={"dateOfHire"} label={t("dateOfHire")} />
            <DatePickerField
              name={"dateOfLastAdvancement"}
              label={t("dateOfLastAdvancement")}
            />
            <DatePickerField
              name={"dateOfCriminalRecordCheck"}
              label={t("lastCriminalRecordCheck")}
            />

            <SelectField
              label={t("sendAgenda")}
              items={sendAgendaFrequency}
              name="sendAgendaFrequency"
            />
            <SelectField
              label={t("isTeacher")}
              items={isTeacherItems}
              name="isTeacher"
            />

            <div className="col-span-full mx-2 flex flex-col gap-2">
              <FormField
                control={form.control}
                name={"observation"}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>{t("observations")}</FormLabel>
                    <FormControl>
                      <Textarea
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                        className="h-24 rounded-md border p-2"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="m-4 flex items-center justify-end gap-4">
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              updateStaffMutation.isPending || createStaffMutation.isPending
            }
            size={"sm"}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
