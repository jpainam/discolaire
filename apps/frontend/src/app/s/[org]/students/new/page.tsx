/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  SaveIcon,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { StudentStatus } from "@repo/db/enums";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Progress } from "@repo/ui/components/progress";
import { cn } from "@repo/ui/lib/utils";

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

export default function Page() {
  const {
    currentStep,
    studentData,
    selectedParents,
    setStep1IsValid,
    setStep2IsValid,
    setStep3IsValid,
    setCurrentStep,
    updateStudentData,
    addParent,
    removeParent,
    markStepComplete,
    isStepComplete,
    canProceedToStep,
    resetForm,
  } = useStudentStore();

  const t = useTranslations();

  const STEPS = [
    {
      id: 1,
      title: t("Basic Information"),
      description: "",
      icon: User,
      schema: basicInfoSchema,
    },
    {
      id: 2,
      title: t("Academic Details"),
      description: "",
      icon: Building,
      schema: academicInfoSchema,
    },
    // {
    //   id: 3,
    //   title: "Contact & Address",
    //   description: "",
    //   icon: MapPin,
    //   schema: contactInfoSchema,
    // },
    { id: 3, title: t("Parents Guardians"), description: "", icon: Users },
    { id: 4, title: "Review Submit", description: "", icon: Check },
  ];

  const getCurrentSchema = () => {
    const step = STEPS.find((s) => s.id === currentStep);
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
      lastName: "",
      dateOfBirth: undefined,
      placeOfBirth: "",
      gender: "male",
      residence: "",
      phoneNumber: "",
      isRepeating: false,
      isNew: true,
      countryId: "",
      classroomId: "",
      externalAccountingNo: "",
      dateOfExit: undefined,
      dateOfEntry: new Date(),
      formerSchoolId: "",
      allergies: "",
      observation: "",
      religionId: "",
      isBaptized: false,
      status: StudentStatus.ACTIVE,
      clubs: [],
      sports: [],
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    const schema = getCurrentSchema();
    if (schema) {
      const isValid = await form.trigger();
      if (!isValid) return;

      const formData = form.getValues();
      //updateStudentData(formData);
      markStepComplete(currentStep);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      //form.reset(studentData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      //.reset(studentData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("[v0] Submitting student data:", {
        studentData,
        selectedParents,
      });
      // Here you would typically send data to your API
      alert("Student successfully added!");
      resetForm();
    } catch (error) {
      console.error("[v0] Submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="bg-muted/50 flex flex-row items-center justify-between border-b px-4 py-2">
            <h1 className="text-lg font-semibold">New Student Registration</h1>
            <div className="flex flex-row justify-end space-x-4">
              <Button
                variant="outline"
                size={"sm"}
                type="button"
                onClick={() => prevStep()}
                disabled={currentStep === 1}
              >
                <ArrowLeft />
                Prev step
              </Button>
              {currentStep != STEPS.length && (
                <Button
                  size={"sm"}
                  type="button"
                  onClick={() => nextStep()}
                  disabled={currentStep >= STEPS.length}
                >
                  Next step
                  <ArrowRight />
                </Button>
              )}
              {currentStep == STEPS.length && (
                <Button size={"sm"} type="submit">
                  {t("submit")}
                  <SaveIcon />
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 py-2">
            <div className="">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-muted-foreground text-sm">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <Stepper
              // defaultValue={2}
              value={currentStep}
              onValueChange={setCurrentStep}
            >
              {STEPS.map(({ id, title, description, icon }, index) => {
                const Icon = icon;
                const isCompleted = isStepComplete(id);
                const canAccess = canProceedToStep(id);
                const bgColor =
                  id == currentStep
                    ? "bg-blue-100 dark:text-blue-100 text-blue-700 dark:bg-blue-900"
                    : id < currentStep
                      ? "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed";
                return (
                  <StepperItem
                    key={index}
                    step={id}
                    className="not-last:flex-1 max-md:items-start"
                  >
                    <StepperTrigger
                      type="button"
                      // onClick={async () => {
                      //   const schema = getCurrentSchema();
                      //   if (schema) {
                      //     const isValid = await form.trigger();
                      //     if (!isValid) return;
                      //     markStepComplete(currentStep);
                      //   }
                      // }}
                      className={cn(
                        "gap-4 rounded-lg border px-3 py-2 max-md:flex-col",
                        bgColor,
                        //!isCompleted && "bg-red-500",
                      )}
                    >
                      <StepperIndicator />
                      <div className="text-center md:-order-1 md:text-left">
                        <StepperTitle className="flex items-center gap-1.5">
                          <Icon className={cn("h-5 w-5", bgColor)} />
                          {title}
                          {/* {title.split(" ")[0]}
                          <br />
                          {title.split(" ")[1]} */}
                        </StepperTitle>
                        <StepperDescription className="max-sm:hidden">
                          {description}
                        </StepperDescription>
                      </div>
                    </StepperTrigger>
                    {id < STEPS.length && (
                      <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
                    )}
                  </StepperItem>
                );
              })}
            </Stepper>
            {currentStep == 1 && <Step1 />}
            {currentStep == 2 && <Step2 />}
            {/* {currentStep == 3 && <Step3 />} */}
            {currentStep == 3 && <Step3 />}
            {currentStep == 4 && <Step4 />}
          </div>
        </div>
      </form>
    </Form>
  );
}
