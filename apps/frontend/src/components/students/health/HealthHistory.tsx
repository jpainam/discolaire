"use client";
import { Textarea } from "@repo/ui/components/textarea";

import type { RouterOutputs } from "@repo/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Form, useForm } from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Ambulance } from "lucide-react";
import { z } from "zod";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";

const schemaForm = z.object({
  hasADD: z.boolean().default(false),
  addNotes: z.string().optional(),
  hasAllergies: z.boolean().default(false),
  allergyFood: z.boolean().default(false),
  allergyInsectStings: z.boolean().default(false),
  allergyPollen: z.boolean().default(false),
  allergyAnimals: z.boolean().default(false),
  allergyMedications: z.boolean().default(false),
  allergyNotes: z.string().optional(),
  usesEpiPenAtSchool: z.boolean().optional(),
  hasAsthma: z.boolean().default(false),
  asthmaNotes: z.string().optional(),
  inhalerAtSchool: z.boolean().optional(),
  hasMobilityIssues: z.boolean().default(false),
  mobilityNotes: z.string().optional(),
  hasDiabetes: z.boolean().default(false),
  diabetesNotes: z.string().optional(),
  needsInsulinOrGlucometer: z.boolean().optional(),
  hasEarThroatInfections: z.boolean().default(false),
  earThroatNotes: z.string().optional(),
  hasEmotionalIssues: z.boolean().default(false),
  emotionalNotes: z.string().optional(),
});

export function HealthHistory({
  issue,
}: {
  issue: RouterOutputs["health"]["issues"];
}) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const updateIssueMutation = api.health.updateIssues.useMutation({
    onSettled: () => {
      void utils.health.invalidate();
    },
  });
  const form = useForm({
    schema: schemaForm,
    defaultValues: {
      hasADD: issue?.hasADD ?? false,
      addNotes: issue?.addNotes ?? "",
      hasAllergies: issue?.hasAllergies ?? false,
      allergyFood: issue?.allergyFood ?? false,
      allergyInsectStings: issue?.allergyInsectStings ?? false,
      allergyPollen: issue?.allergyPollen ?? false,
      allergyAnimals: issue?.allergyAnimals ?? false,
      allergyMedications: issue?.allergyMedications ?? false,
      allergyNotes: issue?.allergyNotes ?? "",
      usesEpiPenAtSchool: issue?.usesEpiPenAtSchool ?? false,
      hasAsthma: issue?.hasAsthma ?? false,
      asthmaNotes: issue?.asthmaNotes ?? "",
      inhalerAtSchool: issue?.inhalerAtSchool ?? false,
      hasMobilityIssues: issue?.hasMobilityIssues ?? false,
      mobilityNotes: issue?.mobilityNotes ?? "",
      hasDiabetes: issue?.hasDiabetes ?? false,
      diabetesNotes: issue?.diabetesNotes ?? "",
      needsInsulinOrGlucometer: issue?.needsInsulinOrGlucometer ?? false,
      hasEarThroatInfections: issue?.hasEarThroatInfections ?? false,
      earThroatNotes: issue?.earThroatNotes ?? "",
      hasEmotionalIssues: issue?.hasEmotionalIssues ?? false,
      emotionalNotes: issue?.emotionalNotes ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof schemaForm>) => {
    updateIssueMutation.mutate(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex flex-row items-center gap-2">
              <Ambulance />
              {t("past_and_present_health_problems")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("please_check_all_that_apply")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm grid 2xl:grid-cols-2 gap-6 divide">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-row items-center gap-4">
                <RadioGroup defaultValue="no" className="flex flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="add-yes" />
                    <Label htmlFor="add-yes">{t("yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="add-no" />
                    <Label htmlFor="add-no">{t("no")}</Label>
                  </div>
                </RadioGroup>
                <div className="flex flex-col space-y-2">
                  <span>{t("attention_deficit_disorder")}</span>
                  <span>{t("please_explain_and_document_every_drugs")}</span>
                </div>
              </div>
              <Textarea placeholder="Observation / Médicaments / Traitements" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-row items-center gap-4">
                <RadioGroup defaultValue="no" className="flex flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="add-yes" />
                    <Label htmlFor="add-yes">{t("yes")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="add-no" />
                    <Label htmlFor="add-no">{t("no")}</Label>
                  </div>
                </RadioGroup>
                <div className="flex flex-col space-y-2">
                  <span>{}Condition musculaire/Mobilité</span>
                  <span>{t("please_explain_and_document_every_drugs")}</span>
                </div>
              </div>
              <Textarea placeholder="Observation / Médicaments / Traitements" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid w-full grid-cols-1 text-sm gap-6 xl:grid-cols-2">
              <div>
                <span>Notes internes: (Invisible sur les rapports)</span>
                <Textarea />
              </div>
              <div>
                <span>Observations médicales: (Visible sur les rapports)</span>
                <Textarea />
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
