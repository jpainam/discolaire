"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

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
import { useStudentStore } from "./store";
import { academicInfoSchema, basicInfoSchema } from "./validation";

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
  const {
    currentStep,
    studentData,
    setCurrentStep,
    updateStudentData,
    markStepComplete,
    // isStepComplete,
    // canProceedToStep,
    // resetForm,
  } = useStudentStore();

  const getCurrentSchema = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step?.schema;
  };

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolver: getCurrentSchema() ? zodResolver(getCurrentSchema()!) : undefined,
    defaultValues: studentData,
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

  const nextStep = async () => {
    const schema = getCurrentSchema();
    if (schema) {
      const isValid = await form.trigger();
      if (!isValid) return;

      const formData = form.getValues();
      updateStudentData(formData);
      markStepComplete(currentStep);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      //.reset(studentData);
    }
  };
  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div className="bg-muted flex flex-row items-center gap-2 border-b px-4 py-1">
          <Label>{t("Add Student")}</Label>
          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              onClick={() => prevStep()}
              disabled={currentStep === 1}
              variant={"secondary"}
              type="button"
              size="sm"
            >
              <ArrowLeft />
              {t("previous")}
            </Button>
            <Button
              onClick={() => nextStep()}
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
