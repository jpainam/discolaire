"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/stepper";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AcademicInfoStep } from "./AcademicInfoStep";
import { BasicInfoStep } from "./BasicInfoStep";
import { ParentsStep } from "./ParentsStep";
import { ReviewSubmitStep } from "./ReviewSubmitStep";
import { useStudentFormContext } from "./StudentFormContext";
import { studentSchema } from "./validation";

const stepFormIdMap: Record<number, string> = {
  1: "student-basic-info-form",
  2: "student-academic-info-form",
  3: "student-parents-form",
};

export function CreateEditStudent() {
  const t = useTranslations();
  const {
    currentStep,
    setCurrentStep,
    basicInfo,
    academicInfo,
    selectedParents,
  } = useStudentFormContext();

  const steps = [
    {
      id: 1,
      title: t("Basic Information"),
      description: "Information basic about the student",
      icon: User,
    },
    {
      id: 2,
      title: t("Academic Details"),
      description: "Information about the academic details",
      icon: Building,
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

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const parsed = studentSchema.parse({
      ...basicInfo,
      ...academicInfo,
    });

    // TODO: replace with API submission
    console.log("[students/new2] Submitting student data:", {
      studentData: parsed,
      selectedParents,
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <BasicInfoStep onNextAction={nextStep} />;
      case 2:
        return <AcademicInfoStep onNextAction={nextStep} />;
      case 3:
        return <ParentsStep />;
      case 4:
        return <ReviewSubmitStep />;
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1">
        <Label>{t("add")}</Label>
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
            currentStep === 3 ? (
              <Button variant="default" type="button" onClick={nextStep}>
                {t("next")}
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="default"
                type="submit"
                form={stepFormIdMap[currentStep]}
              >
                {t("next")}
                <ArrowRight />
              </Button>
            )
          ) : (
            <Button type="button" variant="default" onClick={handleSubmit}>
              {t("submit")}
            </Button>
          )}
        </div>
      </div>

      <Stepper
        defaultValue={1}
        value={currentStep}
        onValueChange={(step) => {
          if (step <= currentStep) {
            setCurrentStep(step);
          }
        }}
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
    </div>
  );
}
