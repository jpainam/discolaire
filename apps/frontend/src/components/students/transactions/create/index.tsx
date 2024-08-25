"use client";

import { CreditCard, MonitorCheck, X } from "lucide-react";

import type { StepItem } from "@repo/ui/Stepper";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Step, Stepper, useStepper } from "@repo/ui/Stepper";

import Step1 from "./step1";
import Step2 from "./step2";
import { SuccessStep } from "./SuccessStep";

const steps = [
  { label: "Infos", icon: CreditCard },
  { label: "Valider", icon: MonitorCheck },
  // { label: "Paiement", icon: Banknote },
] satisfies StepItem[];

export default function MakePaymentStepper() {
  return (
    <div className="flex w-full flex-col gap-4 px-2">
      <Stepper initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {index == 0 && <Step1 />}
              {index == 1 && <Step2 />}
              {/* {index == 2 && <Step3 />} */}
            </Step>
          );
        })}
        <Footer />
      </Stepper>
    </div>
  );
}

const Footer = () => {
  const { t } = useLocale();
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && <SuccessStep />}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            <X className="mr-2 h-4 w-4" />
            {t("close")}
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
