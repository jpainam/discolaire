"use client";

import { subMonths } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { SheetClose, SheetFooter } from "@repo/ui/components/sheet";
import { api } from "~/trpc/react";
import { DatePicker } from "../DatePicker";
import { CountryPicker } from "../shared/CountryPicker";
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
      isTeacher: staff?.isTeacher ? "yes" : "no",
      dateOfBirth: staff?.dateOfBirth
        ? toZonedTime(staff.dateOfBirth, "UTC")
        : subMonths(new Date(), 100),
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
      isTeacher: data.isTeacher === "yes",
      dateOfBirth: data.dateOfBirth,
    };
    if (staff) {
      toast.loading(t("updating"), { id: 0 });
      updateStaffMutation.mutate({ ...values, id: staff.id });
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

  const genders = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="grid overflow-y-auto flex-1 auto-rows-min gap-2 px-4">
          <div className="grid grid-cols-[20%_80%] gap-2">
            <SelectField label={t("civility")} name="prefix" items={prefixes} />
            <InputField name="lastName" label={t("lastName")} />
          </div>

          <InputField name="firstName" label={t("firstName")} />
          <InputField name="email" label={t("email")} />
          <div className="grid grid-cols-2 gap-2">
            <InputField name="phoneNumber1" label={`${t("phone")} 1`} />
            <InputField name="phoneNumber2" label={`${t("phone")} 2`} />
          </div>

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
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              name="gender"
              label={t("gender")}
              placeholder={t("gender")}
              items={genders}
            />
            <SelectField
              label={t("employmentType")}
              items={employmentTypeItems}
              name="employmentType"
            />
          </div>

          <InputField name="address" label={t("address")} />

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
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateOfBirth")}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfHire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateOfHire")}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfLastAdvancement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateOfLastAdvancement")}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfCriminalRecordCheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lastCriminalRecordCheck")}</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
          </div>

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

        <SheetFooter>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              isLoading={
                updateStaffMutation.isPending || createStaffMutation.isPending
              }
              size={"sm"}
              type="submit"
            >
              {t("submit")}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" size={"sm"}>
                {t("cancel")}
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </form>
    </Form>
  );
}
