"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";

export function SubscriptionPlans({ plan }: { plan: string }) {
  const [selectedPlan, setSelectedPlan] = useState(plan);

  const t = useTranslations();
  const confirm = useConfirm();
  const alertContent = (
    <>{t("contact_your_school_for_paiement_and_subscription")}</>
  );

  const plans = [
    {
      id: "hobby",
      name: "Hobby",
      price: "1,000",
      description: t("hobby_description"),
      features: [
        t("subscription_hobby_1"),
        t("subscription_hobby_2"),
        t("subscription_hobby_3"),
        t("subscription_hobby_4"),
        t("subscription_hobby_5"),
        t("subscription_hobby_6"),
        t("subscription_hobby_7"),
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "3,000",
      description: t("pro_description"),
      features: [
        t("subscription_pro_1"),
        t("subscription_pro_2"),
        t("subscription_pro_3"),
        t("subscription_pro_4"),
        t("subscription_pro_5"),
        t("subscription_pro_6"),
        t("subscription_pro_7"),
      ],
    },
    {
      id: "full",
      name: t("full"),
      price: t("custom"),
      description: t("full_description"),
      features: [
        t("subscription_full_1"),
        t("subscription_full_2"),
        t("subscription_full_3"),
        t("subscription_full_4"),
        t("subscription_full_5"),
        t("subscription_full_6"),
        t("subscription_full_7"),
        t("subscription_full_8"),
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl p-4">
      {/* <h2 className="text-xl font-bold text-center mb-8">
      
      </h2> */}
      <RadioGroup
        value={selectedPlan}
        onValueChange={(val) => {
          setSelectedPlan(val);
          // await confirm({
          //   title: t("subscriptions"),
          //   description: alertContent,
          //   confirmText: t("confirm"),
          //   cancelText: t("cancel"),
          // });
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
            <Card
              className={cn(
                "h-full transition-all duration-200",
                selectedPlan === plan.id
                  ? "border-primary ring-primary ring-2"
                  : "border-border hover:border-primary/50",
              )}
            >
              {selectedPlan === plan.id && (
                <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 transform">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  {plan.id !== "full" && (
                    <span className="text-muted-foreground ml-1">
                      /{t("month")}
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className="w-full"
                  onClick={async () => {
                    setSelectedPlan(plan.id);
                    await confirm({
                      title: t("subscriptions"),
                      description: alertContent,
                      confirmText: t("confirm"),
                      cancelText: t("cancel"),
                    });
                  }}
                >
                  {selectedPlan === plan.id
                    ? t("current_plan")
                    : t("select_plan")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
