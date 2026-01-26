"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { CountryPicker } from "~/components/shared/CountryPicker";
import PrefixSelector from "~/components/shared/forms/PrefixSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { StaffAvatarDropzone } from "./StaffAvatarDropzone";

const staffCreateSchema = z.object({
  prefix: z.string().min(1),
  lastName: z.string().min(1),
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
  employmentType: z.enum(["cdi", "cdd", "internship", "freelance"]),
  jobTitle: z.string().optional(),
  specialty: z.string().optional(),
  weeklyWorkingHours: z.coerce.number().min(1).max(168),
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
export default function CreateEditStaff({
  staff,
}: {
  staff?: RouterOutputs["staff"]["all"][number];
}) {
  const [autoGenerateEmail] = useState(false);
  const t = useTranslations();
  const defaultValues: StaffFormInput = {
    prefix: "M",
    lastName: "",
    firstName: "",
    dateOfBirth: staff?.dateOfBirth ?? undefined,
    placeOfBirth: "",
    gender: staff?.gender ?? "male",
    phoneNumber1: staff?.phoneNumber1 ?? "",
    phoneNumber2: staff?.phoneNumber2 ?? "",
    countryId: staff?.countryId ?? "",
    email: staff?.email ?? "",
    address: staff?.address ?? "",
    dateOfHire: staff?.dateOfHire ?? undefined,
    dateOfRelease: staff?.dateOfRelease ?? undefined,
    jobTitle: staff?.jobTitle ?? "",
    employmentType: (staff?.employmentType ?? "cdi") as
      | "cdi"
      | "cdd"
      | "internship"
      | "freelance",
    specialty: staff?.specialty ?? "",
    weeklyWorkingHours: 40,
    baseSalary: "",
    travelAllowance: "",
    phoneAllowance: "",
    housingAllowance: "",
    transportAllowance: "",
    performanceBonus: "",
    bankName: "",
    accountNumber: "",
    bankCode: "",
    cnps: staff?.cnps ?? "",
    cnss: staff?.cnss ?? "",
    tax: staff?.tax ?? "",
  };
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: staffCreateSchema,
    },
    onSubmit: () => {},
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Créer un personnel</CardTitle>
          <CardDescription>
            Veuillez vérifier si le personnel n'existe pas déjà
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <InputGroup>
              <InputGroupInput placeholder={t("search")} />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Button>{t("search")}</Button>
          </div>
        </CardContent>
      </Card>

      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <Accordion
          type="multiple"
          defaultValue={["personal", "professional", "contractual"]}
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
                  <form.Field
                    name="lastName"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Nom <span className="text-destructive">*</span>
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
                </FieldGroup>

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

                <form.Field
                  name="dateOfBirth"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Date de naissance{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="plateOfBirth"
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
                        <FieldLabel htmlFor={field.name}>
                          Téléphone 1
                        </FieldLabel>
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
                        <FieldLabel htmlFor={field.name}>
                          Téléphone 2
                        </FieldLabel>
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
                          disabled={autoGenerateEmail}
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
                <StaffAvatarDropzone />
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
                        Date d&apos;embauche{" "}
                      </FieldLabel>
                      <DatePicker
                        defaultValue={field.state.value ?? undefined}
                        onSelectAction={(date) => field.handleChange(date)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
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
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                        onValueChange={(value) =>
                          field.handleChange(
                            value as "cdi" | "cdd" | "internship" | "freelance",
                          )
                        }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      autoComplete="off"
                    />
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
                    <FieldLabel htmlFor={field.name}>
                      Salaire de Base
                    </FieldLabel>
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="accountNumber"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Numéro de compte
                    </FieldLabel>
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit">{t("add")}</Button>
        </div>
      </form>
    </div>
  );
}
