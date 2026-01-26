"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import type { StudentData } from "./validation";
import { DatePicker } from "~/components/DatePicker";
import { CountryPicker } from "~/components/shared/CountryPicker";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { ClubMultiSelector } from "~/components/shared/selects/ClubMultiSelector";
import { FormerSchoolSelector } from "~/components/shared/selects/FormerSchoolSelector";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { SportMultiSelector } from "~/components/shared/selects/SportMultiSelector";
import { StudentStatusSelector } from "~/components/shared/selects/StudentStatusSelector";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/stepper";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
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
import { useModal } from "~/hooks/use-modal";
import { UserIcon } from "~/icons";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateParent } from "./CreateParent";
import { initialStudentData } from "./store";
import {
  academicInfoSchema,
  basicInfoSchema,
  studentSchema,
} from "./validation";

interface SelectedParent {
  id: string;
  name: string;
  relationshipId: string;
}

const stepFieldMap: Record<number, (keyof StudentData)[]> = {
  1: [
    "firstName",
    "lastName",
    "dateOfBirth",
    "placeOfBirth",
    "gender",
    "countryId",
    "bloodType",
    "religionId",
    "clubs",
    "sports",
    "isBaptized",
    "tags",
    "registrationNumber",
    "externalAccountingNo",
    "phoneNumber",
    "residence",
    "allergies",
    "observation",
  ],
  2: [
    "classroomId",
    "dateOfEntry",
    "dateOfExit",
    "isRepeating",
    "isNew",
    "status",
    "formerSchoolId",
  ],
};

export function CreateEditStudent() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedParents, setSelectedParents] = useState<SelectedParent[]>([]);

  const steps = [
    {
      id: 1,
      title: t("Basic Information"),
      description: "Information basic about the student",
      icon: User,
      schema: basicInfoSchema,
    },
    {
      id: 2,
      title: t("Academic Details"),
      description: "Information about the academic details",
      icon: Building,
      schema: academicInfoSchema,
    },
    {
      id: 3,
      title: t("Parents Guardians"),
      description: "Les parents, contacts et tuteurs",
      icon: Users,
    },
    {
      id: 4,
      title: "Review Submit",
      description: "Revoir les details avant soumission",
      icon: Check,
    },
  ];

  const activeSchema =
    currentStep === steps.length
      ? studentSchema
      : steps.find((step) => step.id === currentStep)?.schema;

  const form = useForm({
    defaultValues: initialStudentData as StudentData,
    validators: activeSchema ? { onSubmit: activeSchema } : undefined,
    onSubmit: ({ value }) => {
      const parsed = studentSchema.parse(value);
      // TODO: replace with API submission

      console.log("[students/new2] Submitting student data:", {
        studentData: parsed,
        selectedParents,
      });
    },
  });

  const markStepFieldsTouched = (step: number) => {
    const fields = stepFieldMap[step] ?? [];
    fields.forEach((field) => {
      form.setFieldMeta(field, (prev) => ({
        ...prev,
        isTouched: true,
      }));
    });
  };

  const nextStep = async () => {
    if (currentStep >= steps.length) return;

    if (activeSchema) {
      markStepFieldsTouched(currentStep);
      const errors = await form.validate("submit");
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddParent = (parent: SelectedParent) => {
    setSelectedParents((prev) => {
      if (prev.some((item) => item.id === parent.id)) {
        return prev;
      }
      return [...prev, parent];
    });
  };

  function Step1() {
    const t = useTranslations();
    const { school } = useSchool();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon />
            {t("Basic Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <form.Field
            name="lastName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("lastName")}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder={t("lastName")}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldLabel htmlFor={field.name}>{t("firstName")}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder={t("firstName")}
                    autoComplete="off"
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
                  <FieldLabel>{t("dateOfBirth")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
          </div>

          <form.Field
            name="gender"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{t("gender")}</FieldLabel>
                  <Select
                    onValueChange={field.handleChange}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <Separator className="col-span-full" />
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    onChange={(event) => field.handleChange(event.target.value)}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
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
          )}
          <Separator className="col-span-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <SelectValue placeholder={t("Select")} />
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    onChangeAction={(values) => field.handleChange(values)}
                  />
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="sports"
              children={(field) => (
                <Field>
                  <FieldLabel>{t("sports")}</FieldLabel>
                  <SportMultiSelector
                    onChangeAction={(values) => field.handleChange(values)}
                  />
                </Field>
              )}
            />
          </div>

          <div className="col-span-full grid gap-4 md:grid-cols-2">
            <form.Field
              name="allergies"
              children={(field) => (
                <Field>
                  <FieldLabel>{t("Allergies & Medical Conditions")}</FieldLabel>
                  <Textarea
                    id="allergies"
                    className="resize-none"
                    value={field.state.value ?? ""}
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
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Observation..."
                    rows={2}
                  />
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  function Step2() {
    const t = useTranslations();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Building className="h-4 w-4" />
            {t("Academic Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="gird-cols-1 grid gap-4 md:grid-cols-3">
          <form.Field
            name="classroomId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("classroom")}</FieldLabel>
                  <ClassroomSelector
                    onSelect={field.handleChange}
                    defaultValue={field.state.value}
                    className="w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="isRepeating"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("repeating")}</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      field.handleChange(val === "yes");
                    }}
                    defaultValue={field.state.value ? "yes" : "no"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_an_option")} />
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
            name="isNew"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("is_new")} ?</FieldLabel>
                  <Select
                    onValueChange={(val) => {
                      field.handleChange(val === "yes");
                    }}
                    defaultValue={field.state.value ? "yes" : "no"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_an_option")} />
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
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("status")}</FieldLabel>
                  <StudentStatusSelector
                    defaultValue={field.state.value}
                    onChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="formerSchoolId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel htmlFor="formerSchoolId">
                    {t("formerSchool")}
                  </FieldLabel>
                  <FormerSchoolSelector
                    className="w-full"
                    onChange={(value) => {
                      field.handleChange(value ?? "");
                    }}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="dateOfEntry"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("dateOfEntry")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="dateOfExit"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex-1">
                  <FieldLabel>{t("dateOfExit")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </CardContent>
      </Card>
    );
  }

  function Step3() {
    const trpc = useTRPC();
    const [query, setQuery] = useState("");
    const debounce = useDebouncedCallback((value: string) => {
      setQuery(value);
    }, 300);

    const { openModal } = useModal();
    const parentSearchQuery = useQuery(
      trpc.contact.all.queryOptions({ query }),
    );
    const t = useTranslations();
    const [relationshipId, setRelationshipId] = useState<string | null>(null);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("Parents Guardians")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder={t("search")}
                value={query}
                onChange={(e) => debounce(e.target.value)}
                className="pl-10"
              />
            </div>
            <RelationshipSelector
              defaultValue={relationshipId}
              onChange={(val) => {
                setRelationshipId(val);
              }}
            />
            <Button
              onClick={() => {
                openModal({
                  view: (
                    <CreateParent
                      setParentIdAction={(id, name, relationship) => {
                        handleAddParent({
                          id,
                          name,
                          relationshipId: relationship,
                        });
                      }}
                    />
                  ),
                });
              }}
              type="button"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("add")}
            </Button>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-lg border">
            {parentSearchQuery.data && parentSearchQuery.data.length > 0 ? (
              parentSearchQuery.data.map((parent) => (
                <div
                  key={parent.id}
                  className="hover:bg-primary/40 hover:text-primary-foreground flex items-center justify-between border-b p-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {parent.prefix} {getFullName(parent)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {parent.phoneNumber1} • {parent.occupation}
                    </p>
                  </div>
                  <Button type="button" variant="default" />
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center">
                {t("no_data")}
              </div>
            )}
          </div>

          <Separator />
        </CardContent>
      </Card>
    );
  }

  function Step4() {
    const t = useTranslations();
    const trpc = useTRPC();
    const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
    const classrooms = classroomsQuery.data ?? [];
    const values = form.state.values;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Check className="h-4 w-4" />
            Review & Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 text-sm">
              <div>
                <strong>{t("lastName")}</strong> {values.lastName}
              </div>
              <div>
                <strong>{t("firstName")}</strong> {values.firstName}
              </div>
              <p>
                <strong>{t("dateOfBirth")}</strong>{" "}
                {values.dateOfBirth?.toString()}
              </p>
              <div>
                <strong>{t("gender")}</strong> {values.gender}
              </div>
              <div>
                <strong>{t("nationality")}</strong> {values.countryId}
              </div>
              <div>
                <strong>{t("classroom")}</strong>{" "}
                {classrooms.find((c) => c.id === values.classroomId)?.name ??
                  "N/A"}
              </div>
              <div>
                <strong>{t("status")}</strong> {t(values.status ?? "")}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <strong>{t("phoneNumber")}</strong> {values.phoneNumber}
              </div>
              <div>
                <strong>{t("address")}</strong> {values.residence}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Parents/Guardians ({selectedParents.length})
            </h3>
            {selectedParents.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                {t("no_data")}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {selectedParents.map((parent) => (
                  <div
                    key={parent.id}
                    className="bg-muted/50 rounded-lg border p-2"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <p className="font-medium">{parent.name}</p>
                      <Badge variant="default" className="text-xs">
                        {parent.relationshipId}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return "Unknown step";
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (currentStep !== steps.length) {
          return;
        }
        void form.handleSubmit();
      }}
    >
      <div className="bg-muted flex flex-row items-center gap-2 border-b px-4 py-1">
        <div className="text-muted-foreground text-sm font-medium">
          {t("add")}
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="secondary"
            type="button"
          >
            <ArrowLeft />
            {t("previous")}
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={nextStep} variant="default" type="button">
              {t("next")}
              <ArrowRight />
            </Button>
          ) : (
            <Button type="submit" variant="default">
              {t("submit")}
            </Button>
          )}
        </div>
      </div>

      <Stepper
        defaultValue={1}
        value={currentStep}
        onValueChange={setCurrentStep}
      >
        {steps.map(({ id, title }) => (
          <StepperItem key={id} step={id} className="relative flex-1 flex-col!">
            <StepperTrigger type="button" className="flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-0.5 px-2">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden" />
              </div>
            </StepperTrigger>
            {id < steps.length && (
              <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <div className="flex-1 px-4">{getStepContent(currentStep)}</div>
    </form>
  );
}
