"use client";

import type { z } from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";

import { DatePicker } from "~/components/DatePicker";
import { CountryPicker } from "~/components/shared/CountryPicker";
import { ClubMultiSelector } from "~/components/shared/selects/ClubMultiSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { SportMultiSelector } from "~/components/shared/selects/SportMultiSelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { Textarea } from "~/components/ui/textarea";
import { UserIcon } from "~/icons";
import { useSchool } from "~/providers/SchoolProvider";
import { StudentAvatarDropzone } from "./StudentAvatarDropzone";
import { useStudentFormContext } from "./StudentFormContext";
import { basicInfoSchema } from "./validation";

type BasicInfoType = z.input<typeof basicInfoSchema>;
interface BasicInfoStepProps {
  onNextAction: () => void;
  initialAvatar?: string | null;
  onAvatarFileChange?: (file: File | null) => void;
}

export function BasicInfoStep({
  onNextAction,
  initialAvatar,
  onAvatarFileChange,
}: BasicInfoStepProps) {
  const t = useTranslations();
  const { school } = useSchool();
  const { basicInfo, setBasicInfo } = useStudentFormContext();
  const defaultValues: BasicInfoType = basicInfo;

  const form = useForm({
    defaultValues,
    validators: { onSubmit: basicInfoSchema },
    onSubmit: ({ value }) => {
      setBasicInfo({
        ...value,
        clubs: value.clubs ?? [],
        sports: value.sports ?? [],
        isBaptized: value.isBaptized ?? false,
        tags: value.tags ?? [],
        externalAccountingNo: value.externalAccountingNo ?? "",
        phoneNumber: value.phoneNumber ?? "",
        allergies: value.allergies ?? "",
        observation: value.observation ?? "",
      });
      onNextAction();
    },
  });

  return (
    <form
      id="student-basic-info-form"
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon />
            {t("Basic Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FieldGroup className="col-span-3 grid gap-4 xl:grid-cols-3">
            <form.Field
              name="lastName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("lastName")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder={t("lastName")}
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
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("firstName")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder={t("firstName")}
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
              name="registrationNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>{t("registrationNumber")}</FieldLabel>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    <FieldLabel>{t("dateOfBirth")}</FieldLabel>
                    <DatePicker
                      defaultValue={field.state.value}
                      onSelectAction={(date) =>
                        date && field.handleChange(date)
                      }
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
                    <FieldLabel>{t("placeOfBirth")}</FieldLabel>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="residence"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>{t("address")}</FieldLabel>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                  <Field data-invalid={isInvalid} className="flex-1">
                    <FieldLabel htmlFor="countryId">
                      {t("citizenship")}
                    </FieldLabel>
                    <CountryPicker
                      placeholder={t("citizenship")}
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
              name="phoneNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>{t("phoneNumber")}</FieldLabel>
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
                    <FieldLabel>{t("gender")}</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.handleChange(value as "male" | "female")
                      }
                      defaultValue={field.state.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("gender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <StudentAvatarDropzone
              initialImage={initialAvatar}
              onFileChange={onAvatarFileChange}
            />
          </FieldGroup>
          <Separator className="col-span-full" />

          {school.requestSunPlusNo && (
            <form.Field
              name="externalAccountingNo"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>{t("External account number")}</FieldLabel>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          )}

          <form.Field
            name="religionId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{t("religion")}</FieldLabel>
                  <ReligionSelector
                    onChange={field.handleChange}
                    defaultValue={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="isBaptized"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{t("baptized")} ?</FieldLabel>
                  <Select
                    defaultValue={field.state.value ? "yes" : "no"}
                    onValueChange={(val) => {
                      field.handleChange(val === "yes");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("baptized")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("yes")}</SelectItem>
                      <SelectItem value="no">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="bloodType"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{t("Blood Type")}</FieldLabel>
                  <Select
                    onValueChange={field.handleChange}
                    defaultValue={field.state.value ?? undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="clubs"
            children={(field) => (
              <Field>
                <FieldLabel>{t("clubs")}</FieldLabel>
                <ClubMultiSelector
                  defaultValue={field.state.value}
                  onChangeAction={(values) => field.handleChange(values)}
                />
              </Field>
            )}
          />
          <form.Field
            name="sports"
            children={(field) => (
              <Field>
                <FieldLabel>{t("sports")}</FieldLabel>
                <SportMultiSelector
                  defaultValue={field.state.value}
                  onChangeAction={(values) => field.handleChange(values)}
                />
              </Field>
            )}
          />

          <FieldGroup className="col-span-full grid gap-4 md:grid-cols-2">
            <form.Field
              name="allergies"
              children={(field) => (
                <Field>
                  <FieldLabel>{t("Allergies & Medical Conditions")}</FieldLabel>
                  <Textarea
                    id="allergies"
                    className="resize-none"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder={t("List any allergies or medical conditions")}
                    rows={2}
                  />
                </Field>
              )}
            />
            <form.Field
              name="observation"
              children={(field) => (
                <Field>
                  <FieldLabel>{t("Observation")}</FieldLabel>
                  <Textarea
                    id="observation"
                    className="resize-none"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Observation..."
                    rows={2}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  );
}
