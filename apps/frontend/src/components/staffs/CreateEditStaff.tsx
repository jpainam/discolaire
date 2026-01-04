"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { DatePicker } from "../DatePicker";
import { CountryPicker } from "../shared/CountryPicker";
import { StaffLevelSelector } from "../shared/selects/StaffLevelSelector";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"][number]>;

const staffCreateEditSchema = z.object({
  prefix: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female"]).default("male"),
  isActive: z.coerce.boolean().default(true),
  jobTitle: z.string().optional(),
  countryId: z.string().optional(),
  observation: z.string().optional(),
  email: z.email().optional().or(z.literal("")),
  degreeId: z.string().optional(),
  employmentType: z.string().optional(),
  address: z.string().optional(),
  phoneNumber1: z.string().min(1),
  phoneNumber2: z.string().optional(),
  dateOfHire: z.date().optional(),
  dateOfRelease: z.date().optional(),
  dateOfCriminalRecordCheck: z.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  dateOfLastAdvancement: z.date().optional(),
  isTeacher: z.string().default("yes"),
  dateOfBirth: z.date().optional(),
});
type StaffFormInput = z.input<typeof staffCreateEditSchema>;
interface CreateEditStaffProps {
  staff?: StaffProcedureOutput;
  formId: string;
}

export function CreateEditStaff({ staff, formId }: CreateEditStaffProps) {
  const { closeSheet } = useSheet();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const defaultValues: StaffFormInput = {
    prefix: staff?.prefix ?? "",
    firstName: staff?.firstName ?? "",
    lastName: staff?.lastName ?? "",
    gender: staff?.gender ?? "male",
    isActive: staff?.isActive ?? true,
    jobTitle: staff?.jobTitle ?? "",
    email: staff?.user?.email ?? "",
    countryId: staff?.countryId ?? "",
    observation: staff?.observation ?? "",
    degreeId: staff?.degreeId ?? "",
    employmentType: staff?.employmentType ?? "",
    address: staff?.address ?? "",
    phoneNumber1: staff?.phoneNumber1 ?? "",
    phoneNumber2: staff?.phoneNumber2 ?? "",
    dateOfHire: staff?.dateOfHire ?? undefined,
    dateOfRelease: staff?.dateOfRelease ?? undefined,
    dateOfCriminalRecordCheck: staff?.dateOfCriminalRecordCheck ?? undefined,
    sendAgendaFrequency: staff?.sendAgendaFrequency ?? "",
    dateOfLastAdvancement: staff?.dateOfLastAdvancement ?? undefined,
    isTeacher: staff?.isTeacher ? "yes" : "no",
    dateOfBirth: staff?.dateOfBirth ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: staffCreateEditSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = staffCreateEditSchema.parse(value);
      const values = {
        prefix: parsed.prefix,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        gender: parsed.gender,
        isActive: parsed.isActive,
        jobTitle: parsed.jobTitle,
        countryId: parsed.countryId,
        observation: parsed.observation,
        degreeId: parsed.degreeId?.trim() ? parsed.degreeId : undefined,
        employmentType: parsed.employmentType,
        address: parsed.address,
        phoneNumber1: parsed.phoneNumber1,
        phoneNumber2: parsed.phoneNumber2,
        email: parsed.email,
        dateOfHire: parsed.dateOfHire,
        dateOfRelease: parsed.dateOfRelease,
        dateOfCriminalRecordCheck: parsed.dateOfCriminalRecordCheck,
        sendAgendaFrequency: parsed.sendAgendaFrequency,
        dateOfLastAdvancement: parsed.dateOfLastAdvancement,
        isTeacher: parsed.isTeacher === "yes",
        dateOfBirth: parsed.dateOfBirth,
      };
      if (staff) {
        toast.loading(t("updating"), { id: 0 });
        updateStaffMutation.mutate({ ...values, id: staff.id });
      } else {
        toast.loading(t("creating"), { id: 0 });
        createStaffMutation.mutate(values);
      }
    },
  });

  const createStaffMutation = useMutation(
    trpc.staff.create.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
        router.push(`/staff/${result.id}`);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateStaffMutation = useMutation(
    trpc.staff.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
    { label: "Dr", value: "Dr" },
  ];

  return (
    <form
      id={formId}
      className="gap-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="flex items-center gap-2">
        <form.Field
          name="prefix"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="w-[100px]">
                <FieldLabel htmlFor={field.name}>{t("civility")}</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder={t("civility")} />
                  </SelectTrigger>
                  <SelectContent>
                    {prefixes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="lastName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="w-full">
                <FieldLabel htmlFor={field.name}>{t("lastName")}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </div>

      <form.Field
        name="firstName"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("firstName")}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <FieldGroup className="grid grid-cols-2 gap-2">
        <form.Field
          name="phoneNumber1"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                >{`${t("phone")} 1`}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="phoneNumber2"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                >{`${t("phone")} 2`}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <form.Field
        name="email"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="jobTitle"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("jobTitle")}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="countryId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("citizenship")}</FieldLabel>
              <CountryPicker
                placeholder={t("citizenship")}
                onChange={(value) => field.handleChange(value)}
                defaultValue={field.state.value ?? undefined}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <FieldGroup className="grid grid-cols-2 gap-2">
        <form.Field
          name="gender"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("gender")}</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "male" | "female")
                  }
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder={t("gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"male"}>{t("male")}</SelectItem>
                    <SelectItem value={"female"}>{t("female")}</SelectItem>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="employmentType"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("employmentType")}
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder={t("select_an_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <form.Field
        name="address"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("address")}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="degreeId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("degree")}</FieldLabel>
              <StaffLevelSelector
                className="w-full"
                onChange={(val) => {
                  field.handleChange(val ?? "");
                }}
                defaultValue={field.state.value}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="dateOfBirth"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("dateOfBirth")}</FieldLabel>
              <DatePicker
                defaultValue={field.state.value ?? undefined}
                onSelectAction={(date) => field.handleChange(date)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="dateOfHire"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("dateOfHire")}</FieldLabel>
              <DatePicker
                defaultValue={field.state.value ?? undefined}
                onSelectAction={(date) => field.handleChange(date)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="dateOfLastAdvancement"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {t("dateOfLastAdvancement")}
              </FieldLabel>
              <DatePicker
                defaultValue={field.state.value ?? undefined}
                onSelectAction={(date) => field.handleChange(date)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="dateOfCriminalRecordCheck"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {t("lastCriminalRecordCheck")}
              </FieldLabel>
              <DatePicker
                defaultValue={field.state.value ?? undefined}
                onSelectAction={field.handleChange}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="sendAgendaFrequency"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("sendAgenda")}</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue placeholder={t("select_an_option")} />
                </SelectTrigger>
                <SelectContent>
                  {sendAgendaFrequency.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="isTeacher"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("isTeacher")}</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue placeholder={t("select_an_option")} />
                </SelectTrigger>
                <SelectContent>
                  {isTeacherItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="observation"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t("observations")}</FieldLabel>
              <Textarea
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                className="resize-none"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    </form>
  );
}
