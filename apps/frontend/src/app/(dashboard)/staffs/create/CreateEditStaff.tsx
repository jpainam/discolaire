"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { CountryPicker } from "~/components/shared/CountryPicker";
import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import { StaffLevelSelector } from "~/components/shared/selects/StaffLevelSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
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
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { StaffAvatarDropzone } from "./StaffAvatarDropzone";

const staffCreateSchema = z.object({
  prefix: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().optional(),
  firstName: z.string().optional(),
  dateOfBirth: z.date().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]),
  bloodType: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  isTeacher: z.boolean().default(true),
  degreeId: z.string().optional(),
  countryId: z.string().optional(),
  dateOfCriminalRecordCheck: z.date().optional(),
  dateOfLastAdvancement: z.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  email: z.email().optional().or(z.literal("")),
  address: z.string().optional(),
  dateOfHire: z.date().optional(),
  dateOfRelease: z.date().optional(),
  employmentType: z.string().min(1).default("cdi"),
  jobTitle: z.string().optional(),
  specialty: z.string().optional(),
  weeklyWorkingHours: z.number().min(1).max(168),
  baseSalary: z.string().optional(),
  travelAllowance: z.string().optional(),
  phoneAllowance: z.string().optional(),
  housingAllowance: z.string().optional(),
  transportAllowance: z.string().optional(),
  performanceBonus: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  cnps: z.string().optional(),
  cnss: z.string().optional(),
  tax: z.string().optional(),
  observation: z.string().optional(),
});

type StaffFormInput = z.input<typeof staffCreateSchema>;
const employmentTypeValues = ["cdi", "cdd", "internship", "freelance"] as const;
const sendAgendaFrequencyValues = [
  "no",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
] as const;

export default function CreateEditStaff({
  staff,
  className,
}: {
  staff?: RouterOutputs["staff"]["get"];
  className?: string;
}) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const router = useRouter();
  const uploadAvatar = async (ownerId: string) => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", avatarFile, avatarFile.name);
      const response = await fetch(
        `/api/upload/avatars?id=${ownerId}&profile=staff`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      setAvatarFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Avatar upload failed",
        { id: 0 },
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  const createStaffMutation = useMutation(
    trpc.staff.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (created) => {
        await uploadAvatar(created.id);
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        router.push(`/staffs/${created.id}`);
      },
    }),
  );
  const updateStaffMutation = useMutation(
    trpc.staff.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (updated) => {
        await uploadAvatar(updated.id);
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        router.push(`/staffs/${updated.id}`);
      },
    }),
  );
  const defaultValues: StaffFormInput = {
    prefix: staff?.prefix ?? "M",
    lastName: staff?.lastName ?? "",
    firstName: staff?.firstName ?? "",
    avatar: staff?.avatar ?? undefined,
    dateOfBirth: staff?.dateOfBirth ?? undefined,
    placeOfBirth: staff?.placeOfBirth ?? "",
    gender: staff?.gender ?? "male",
    bloodType: staff?.bloodType ?? "",
    phoneNumber1: staff?.phoneNumber1 ?? "",
    phoneNumber2: staff?.phoneNumber2 ?? "",
    isTeacher: staff?.isTeacher ?? true,
    degreeId: staff?.degreeId ?? "",
    countryId: staff?.countryId ?? "",
    dateOfCriminalRecordCheck: staff?.dateOfCriminalRecordCheck ?? undefined,
    dateOfLastAdvancement: staff?.dateOfLastAdvancement ?? undefined,
    sendAgendaFrequency: staff?.sendAgendaFrequency?.trim()
      ? staff.sendAgendaFrequency
      : "no",
    email: staff?.email ?? staff?.user?.email ?? "",
    address: staff?.address ?? "",
    dateOfHire: staff?.dateOfHire ?? undefined,
    dateOfRelease: staff?.dateOfRelease ?? undefined,
    jobTitle: staff?.jobTitle ?? "",
    employmentType: staff?.employmentType?.trim()
      ? staff.employmentType
      : "cdi",
    specialty: staff?.specialty ?? "",
    weeklyWorkingHours: staff?.weeklyWorkingHours ?? 40,
    baseSalary: staff?.baseSalary != null ? `${staff.baseSalary}` : "",
    travelAllowance:
      staff?.travelAllowance != null ? `${staff.travelAllowance}` : "",
    phoneAllowance:
      staff?.phoneAllowance != null ? `${staff.phoneAllowance}` : "",
    housingAllowance:
      staff?.housingAllowance != null ? `${staff.housingAllowance}` : "",
    transportAllowance:
      staff?.transportAllowance != null ? `${staff.transportAllowance}` : "",
    performanceBonus:
      staff?.performanceBonus != null ? `${staff.performanceBonus}` : "",
    bankName: staff?.bankName ?? "",
    accountNumber: staff?.accountNumber ?? "",
    bankCode: staff?.bankCode ?? "",
    cnps: staff?.cnps ?? "",
    cnss: staff?.cnss ?? "",
    tax: staff?.tax ?? "",
    observation: staff?.observation ?? "",
  };
  const toNumber = (value?: string) => {
    if (value == null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: staffCreateSchema,
    },
    onSubmit: ({ value }) => {
      const values = {
        ...value,
        firstName: value.firstName ?? "",
        degreeId: value.degreeId?.trim() ? value.degreeId : undefined,
        countryId: value.countryId?.trim() ? value.countryId : undefined,
        baseSalary: toNumber(value.baseSalary),
        travelAllowance: toNumber(value.travelAllowance),
        phoneAllowance: toNumber(value.phoneAllowance),
        housingAllowance: toNumber(value.housingAllowance),
        transportAllowance: toNumber(value.transportAllowance),
        performanceBonus: toNumber(value.performanceBonus),
      };
      if (staff) {
        updateStaffMutation.mutate({
          id: staff.id,
          ...values,
        });
      } else {
        createStaffMutation.mutate(values);
      }
    },
  });

  return (
    <form
      className={cn("flex flex-col space-y-2", className)}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Accordion
        type="multiple"
        defaultValue={[
          "personal",
          "contractual",
          "allocations",
          "banquesInformation",
        ]}
        className="w-full space-y-4 border-0"
      >
        {/* Personal Information Section */}
        <AccordionItem
          value="personal"
          className="bg-card border-border overflow-hidden rounded-lg border"
        >
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Informations Personnelles
          </AccordionTrigger>
          <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-5">
            <FieldGroup className="col-span-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FieldGroup className="col-span-full grid grid-cols-[100px_1fr] items-start gap-2">
                <form.Field
                  name="prefix"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="w-[100px]">
                        <FieldLabel>Prefix</FieldLabel>
                        <PrefixSelector
                          className="w-[100px]"
                          onChange={field.handleChange}
                          defaultValue={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <form.Field
                    name="lastName"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="firstName"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Prénom</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          autoComplete="off"
                        />
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>

              <form.Field
                name="dateOfBirth"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Date de naissance
                      </FieldLabel>
                      <DatePicker
                        defaultValue={field.state.value}
                        onSelectAction={(date) => field.handleChange(date)}
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="placeOfBirth"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Lieu de naissance
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="gender"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Sexe <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as "male" | "female")
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculin</SelectItem>
                          <SelectItem value="female">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="phoneNumber1"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Téléphone 1</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                      <FieldLabel htmlFor={field.name}>Téléphone 2</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="countryId"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nationalité</FieldLabel>
                    <CountryPicker
                      onChange={(value) => {
                        field.handleChange(value);
                      }}
                      defaultValue={field.state.value ?? undefined}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="example@kelasi.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="address"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Adresse</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <StaffAvatarDropzone
                initialImage={staff?.avatar ?? null}
                disabled={
                  createStaffMutation.isPending ||
                  updateStaffMutation.isPending ||
                  isUploadingAvatar
                }
                onFileChange={setAvatarFile}
              />
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Contract Information Section */}
        <AccordionItem
          value="contractual"
          className="bg-card border-border overflow-hidden rounded-lg border"
        >
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Informations Contractuelles
          </AccordionTrigger>

          <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
            <form.Field
              name="dateOfHire"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Date d&apos;embauche
                    </FieldLabel>
                    <DatePicker
                      defaultValue={field.state.value}
                      onSelectAction={(date) => field.handleChange(date)}
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="dateOfRelease"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Date de fin de contrat
                  </FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={(date) => {
                      field.handleChange(date);
                    }}
                  />
                </Field>
              )}
            />

            <form.Field
              name="employmentType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Type de contrat
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cdi">
                          CDI (Contrat à Durée Indéterminée)
                        </SelectItem>
                        <SelectItem value="cdd">
                          CDD (Contrat à Durée Déterminée)
                        </SelectItem>
                        <SelectItem value="internship">Stage</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        {!employmentTypeValues.includes(
                          field.state
                            .value as (typeof employmentTypeValues)[number],
                        ) &&
                          field.state.value && (
                            <SelectItem value={field.state.value}>
                              {field.state.value}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="jobTitle"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Poste</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Ex: Principal, Directrice des Études, Comptable..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="specialty"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Spécialité</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Ex: Maths/Phys, Francais/Philo ..."
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="degreeId"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Niveau d&apos;étude
                  </FieldLabel>
                  <StaffLevelSelector
                    className="w-full"
                    onChange={(value) => {
                      field.handleChange(value ?? "");
                    }}
                    defaultValue={field.state.value ?? undefined}
                  />
                </Field>
              )}
            />
            <form.Field
              name="isTeacher"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Enseignant</FieldLabel>
                  <Select
                    value={field.state.value ? "yes" : "no"}
                    onValueChange={(value) => {
                      field.handleChange(value === "yes");
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Sélectionner une option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Oui</SelectItem>
                      <SelectItem value="no">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <form.Field
              name="sendAgendaFrequency"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Fréquence d&apos;envoi de l&apos;agenda
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Jamais</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="quarterly">Trimestrielle</SelectItem>
                      <SelectItem value="yearly">Annuelle</SelectItem>
                      {!sendAgendaFrequencyValues.includes(
                        field.state
                          .value as (typeof sendAgendaFrequencyValues)[number],
                      ) &&
                        field.state.value && (
                          <SelectItem value={field.state.value}>
                            {field.state.value}
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="weeklyWorkingHours"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Heures de travail/semaine
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    min="1"
                    max="168"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.valueAsNumber;
                      field.handleChange(
                        Number.isNaN(nextValue) ? 0 : nextValue,
                      );
                    }}
                  />
                </Field>
              )}
            />
            <form.Field
              name="observation"
              children={(field) => (
                <Field className="md:col-span-2 lg:col-span-3">
                  <FieldLabel htmlFor={field.name}>Observation</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
        {/** Gestion des Salaires et Allocations */}
        <AccordionItem
          value="allocations"
          className="bg-card border-border overflow-hidden rounded-lg border"
        >
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Gestion des Salaires et Allocations
          </AccordionTrigger>
          <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
            <form.Field
              name="baseSalary"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Salaire de Base</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="travelAllowance"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Allocation Deplacement
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />

            <form.Field
              name="phoneAllowance"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Allocation Telephone
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="housingAllowance"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Allocation Logement
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="transportAllowance"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Allocation Transport
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="performanceBonus"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Prime de performance
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <div className="bg-primary text-primary-foreground col-span-full grid grid-cols-3 rounded-lg p-2">
              <div>Salaire total calculé : </div>
              <div>Mensuel : 0 FCFA </div>
              <div>Annuel : 0 FCFA</div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* * Informations Bancaires */}
        <AccordionItem
          value="banquesInformation"
          className="bg-card border-border overflow-hidden rounded-lg border"
        >
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Informations Bancaires
          </AccordionTrigger>
          <AccordionContent className="border-border grid gap-4 border-t p-4 md:grid-cols-2 lg:grid-cols-3">
            <form.Field
              name="bankName"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Banque</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="accountNumber"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Numéro de compte</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="bankCode"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Code banque</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <Separator className="col-span-full" />
            <form.Field
              name="cnps"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Numéro CNPS</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="cnss"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Numéro CNSS</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <form.Field
              name="tax"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Numéro d&apos;impôt
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            router.back();
          }}
          type="button"
          variant="outline"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={
            createStaffMutation.isPending || updateStaffMutation.isPending
          }
        >
          {(createStaffMutation.isPending || updateStaffMutation.isPending) && (
            <Spinner />
          )}
          {staff ? t("update") : t("add")}
        </Button>
      </div>
    </form>
  );
}
