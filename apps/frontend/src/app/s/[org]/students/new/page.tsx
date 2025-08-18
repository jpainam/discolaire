"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  Home,
  SaveIcon,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

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
import { Step5 } from "./Step5";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm();

  const STEPS = [
    { id: 1, title: "Basic Information", description: "", icon: User },
    {
      id: 2,
      title: "Academic Details",
      description: "",
      icon: Building,
    },
    {
      id: 3,
      title: "Contact Address",
      description: "",
      icon: Home,
    },
    { id: 4, title: "Parents Guardians", description: "", icon: Users },
    { id: 5, title: "Review Submit", description: "", icon: Check },
  ];
  const progress = (currentStep / STEPS.length) * 100;
  const t = useTranslations();
  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col">
          <div className="bg-muted/50 flex flex-row items-center justify-between border-b px-4 py-2">
            <h1 className="text-lg font-semibold">New Student Registration</h1>
            <div className="flex flex-row justify-end space-x-4">
              <Button
                variant="outline"
                size={"sm"}
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
              >
                <ArrowLeft />
                Prev step
              </Button>
              {currentStep != STEPS.length && (
                <Button
                  size={"sm"}
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
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
                      className={cn(
                        "gap-4 rounded-lg border px-3 py-2 max-md:flex-col",
                        bgColor,
                      )}
                    >
                      <StepperIndicator />
                      <div className="text-center md:-order-1 md:text-left">
                        <StepperTitle className="flex items-center gap-1.5">
                          <Icon className={cn("h-5 w-5", bgColor)} />
                          {title.split(" ")[0]}
                          <br />
                          {title.split(" ")[1]}
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
            {currentStep == 3 && <Step3 />}
            {currentStep == 4 && <Step4 />}
            {currentStep == 5 && <Step5 />}
          </div>
        </div>
      </form>
    </Form>
  );
}
