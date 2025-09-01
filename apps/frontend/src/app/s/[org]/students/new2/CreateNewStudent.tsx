"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { StudentStatus } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/stepper";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";

export const basicInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.enum(["male", "female"]),
  countryId: z.string().min(1),
  registrationNumber: z.string().optional(),
  externalAccountingNo: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().min(1),
  allergies: z.string().optional().default(""),
  city: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
});

export const academicInfoSchema = z.object({
  classroomId: z.string().optional().default(""),
  dateOfEntry: z.coerce.date().default(new Date()),
  dateOfExit: z.coerce.date().optional(),
  isRepeating: z.boolean().default(false),
  isNew: z.boolean().default(true),
  status: z
    .enum(["ACTIVE", "INACTIVE", "GRADUATED", "EXPELLED"])
    .default("ACTIVE"),
  formerSchoolId: z.string().min(1),
});

export function CreateNewStudent() {
  const t = useTranslations();
  const steps = [
    {
      id: 1,
      title: t("Basic Information"),
      description: "Information basic about the student",
      schema: basicInfoSchema,
    },
    {
      id: 2,
      title: t("Academic Details"),
      description: "Information about the academic details",
      schema: academicInfoSchema,
    },

    {
      id: 3,
      title: t("Parents Guardians"),
      description: "Les parents, contacts et tuteurs",
      schema: basicInfoSchema,
    },
    {
      id: 4,
      title: "Review Submit",
      description: "Revoir les details avant soumission",
      schema: basicInfoSchema,
    },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const getCurrentSchema = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step?.schema;
  };

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolver: getCurrentSchema() ? zodResolver(getCurrentSchema()!) : undefined,
    defaultValues: {
      registrationNumber: "",
      id: "",
      tags: [],
      firstName: "",
      bloodType: "",
      lastName: "",
      dateOfBirth: undefined,
      placeOfBirth: "",
      gender: "male",
      residence: "",
      phoneNumber: "",
      isRepeating: false,
      isNew: true,
      countryId: "",
      classroom: "",
      allergies: "",
      externalAccountingNo: "",
      dateOfExit: undefined,
      dateOfEntry: new Date(),
      formerSchoolId: "",
      observation: "",
      religionId: "",
      isBaptized: false,
      status: StudentStatus.ACTIVE,
      clubs: [],
      sports: [],
    },
  });

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
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div className="bg-muted flex flex-row items-center gap-2 border-b px-4 py-1">
          <Label>{t("Create a new student")}</Label>
          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              onClick={() => {
                setCurrentStep((prev) => prev - 1);
              }}
              disabled={currentStep === 1}
              variant={"secondary"}
              type="button"
              size="sm"
            >
              <ArrowLeft />
              {t("previous")}
            </Button>
            <Button
              onClick={async () => {
                const isValid = await form.trigger();
                if (!isValid) return;
                setCurrentStep((prev) => prev + 1);
              }}
              disabled={currentStep >= steps.length}
              variant={"default"}
              type="button"
              size="sm"
            >
              {t("next")}
              <ArrowRight />
            </Button>
          </div>
        </div>

        <Stepper
          defaultValue={1}
          value={currentStep}
          onValueChange={setCurrentStep}
        >
          {steps.map(({ id, title }) => (
            <StepperItem
              key={id}
              step={id}
              className="relative flex-1 flex-col!"
            >
              <StepperTrigger type="button" className="flex-col gap-3 rounded">
                <StepperIndicator />
                <div className="space-y-0.5 px-2">
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">
                    {/* {description} */}
                  </StepperDescription>
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
    </Form>
  );
}
