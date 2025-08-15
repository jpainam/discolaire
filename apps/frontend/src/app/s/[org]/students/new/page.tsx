"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  Home,
  User,
  Users,
} from "lucide-react";

import { Button } from "@repo/ui/components/button";
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

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);

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
  return (
    <div className="flex flex-col">
      <div className="bg-muted/50 flex flex-row items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-semibold">New Student Registration</h1>
        <div className="flex flex-row justify-end space-x-4">
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft />
            Prev step
          </Button>
          <Button
            size={"sm"}
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep >= STEPS.length}
          >
            Next step
            <ArrowRight />
          </Button>
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
                  ? "bg-green-100 dark:text-green-100 text-green-700 dark:bg-green-900 hover:bg-green-200"
                  : "bg-muted/50 text-muted-foreground cursor-not-allowed";
            return (
              <StepperItem
                key={index}
                step={id}
                className="not-last:flex-1 max-md:items-start"
              >
                <StepperTrigger
                  className={cn(
                    "gap-4 rounded-lg px-3 py-2 max-md:flex-col",
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
        <p
          className="text-muted-foreground mt-2 text-xs"
          role="region"
          aria-live="polite"
        >
          Stepper with inline titles and descriptions
        </p>
      </div>
    </div>
  );
}
