"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Ambulance } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

const schemaForm = z.object({
  hasAdd: z.boolean().default(false),
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
  hasEpilepsy: z.boolean().default(false),
  epilepsyNotes: z.string().optional(),
  frequentHeadaches: z.boolean().default(false),
  frequentHeadachesNotes: z.string().optional(),
  hasHeadInjuries: z.boolean().default(false),
  headInjuriesNotes: z.string().optional(),
  hasHeartIssues: z.boolean().default(false),
  heartIssuesNotes: z.string().optional(),
  hasHearingLoss: z.boolean().default(false),
  hearingLossNotes: z.string().optional(),
  hasSeizures: z.boolean().default(false),
  seizuresNotes: z.string().optional(),
  hasHandicap: z.boolean().default(false),
  handicapNotes: z.string().optional(),
  hasSkinProblems: z.boolean().default(false),
  skinProblemsNotes: z.string().optional(),
  hasVisionProblems: z.boolean().default(false),
  visionProblemsNotes: z.string().optional(),
  hasUrinaryProblems: z.boolean().default(false),
  urinaryProblemsNotes: z.string().optional(),
  hospitalizationIssues: z.boolean().default(false),
  hospitalizationNotes: z.string().optional(),
  internalObservations: z.string().optional(),
  observations: z.string().optional(),
});

export function HealthHistory({ studentId }: { studentId: string }) {
  const t = useTranslations();
  //const params = useParams<{id: string}>();
  const trpc = useTRPC();
  const { data: issue } = useSuspenseQuery(
    trpc.health.issues.queryOptions(studentId),
  );
  const queryClient = useQueryClient();

  const updateIssueMutation = useMutation(
    trpc.health.updateIssues.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.issues.pathFilter());
        toast.success(t("updated_successfully"), { id: 1 });
      },
    }),
  );
  const form = useForm({
    resolver: standardSchemaResolver(schemaForm),
    defaultValues: {
      hasAdd: issue?.hasAdd ?? false,
      addNotes: issue?.addNotes ?? "",
      hospitalizationIssues: issue?.hospitalizationIssues ?? false,
      hospitalizationNotes: issue?.hospitalizationNotes ?? "",
      internalObservations: issue?.internalObservations ?? "",
      observations: issue?.observations ?? "",
      hasVisionProblems: issue?.hasVisionProblems ?? false,
      visionProblemsNotes: issue?.visionProblemsNotes ?? "",
      hasAllergies: issue?.hasAllergies ?? false,
      frequentHeadaches: issue?.frequentHeadaches ?? false,
      frequentHeadachesNotes: issue?.frequentHeadachesNotes ?? "",
      headInjuriesNotes: issue?.headInjuriesNotes ?? "",
      hasHeadInjuries: issue?.hasHeadInjuries ?? false,
      hasHeartIssues: issue?.hasHeartIssues ?? false,
      heartIssuesNotes: issue?.heartIssuesNotes ?? "",
      hasHearingLoss: issue?.hasHearingLoss ?? false,
      hearingLossNotes: issue?.hearingLossNotes ?? "",
      hasHandicap: issue?.hasHandicap ?? false,
      handicapNotes: issue?.handicapNotes ?? "",
      hasSeizures: issue?.hasSeizures ?? false,
      seizuresNotes: issue?.seizuresNotes ?? "",
      hasSkinProblems: issue?.hasSkinProblems ?? false,
      skinProblemsNotes: issue?.skinProblemsNotes ?? "",
      hasUrinaryProblems: issue?.hasUrinaryProblems ?? false,
      hasEpilepsy: issue?.hasEpilepsy ?? false,
      epilepsyNotes: issue?.epilepsyNotes ?? "",
      urinaryProblemsNotes: issue?.urinaryProblemsNotes ?? "",
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
    updateIssueMutation.mutate({ ...data, studentId: studentId });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <Ambulance />
              {t("past_and_present_health_problems")}
              <div className="ml-auto flex flex-row items-center gap-2">
                <Button isLoading={updateIssueMutation.isPending} size={"sm"}>
                  {t("submit")}
                </Button>
                <Button variant={"outline"} type="reset" size={"sm"}>
                  {t("reset")}
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("please_check_all_that_apply")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 text-sm lg:grid-cols-2">
            <RadioFormItem
              title={t("attention_deficit_disorder")}
              name="hasAdd"
              textarea="addNotes"
            />
            <RadioFormItem
              title={t("fainting_sudden_loss_of_consciousness")}
              name="hasEpilepsy"
              textarea="epilepsyNotes"
            />
            <RadioFormItem
              title={t("frequent_headaches_or_migraines")}
              name="frequentHeadaches"
              textarea="frequentHeadachesNotes"
            />
            <RadioFormItem
              title={t("head_injuries_or_any_major_accidents")}
              name="hasHeadInjuries"
              textarea="headInjuriesNotes"
            />
            <RadioFormItem
              title={t("heart_blood_disease_or_high_blood_pressure")}
              name="hasHeartIssues"
              textarea="heartIssuesNotes"
            />
            <RadioFormItem
              title={t("hearing_loss")}
              name="hasHearingLoss"
              textarea="hearingLossNotes"
            />
            <RadioFormItem
              title={t("physical_handicap")}
              name="hasHandicap"
              textarea="handicapNotes"
            />
            <RadioFormItem
              title={t("seizure_disorder")}
              name="hasSeizures"
              textarea="seizuresNotes"
            />
            <RadioFormItem
              title={t("skin_problems")}
              name="hasSkinProblems"
              textarea="skinProblemsNotes"
            />
            <RadioFormItem
              title={t("urinary_bowel_condition")}
              name="hasUrinaryProblems"
              textarea="urinaryProblemsNotes"
            />
          </CardContent>
          <CardFooter>
            <div className="grid w-full grid-cols-1 gap-6 text-sm xl:grid-cols-2">
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

function RadioFormItem({
  title,
  name,
  textarea,
}: {
  title: string;
  name: string;
  textarea: string;
}) {
  const form = useFormContext();

  const t = useTranslations();
  const radioValue = form.watch(name) as boolean;
  return (
    <div className="flex flex-row items-start space-x-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 py-0.5">
            <FormControl>
              <RadioGroup
                onValueChange={(val) => field.onChange(val === "yes")}
                defaultValue={field.value ? "yes" : "no"}
                className="flex flex-row gap-4"
              >
                <FormItem className="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel>{t("yes")}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel>{t("no")}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid w-full grid-cols-1 gap-2 pl-4">
        <div>{title}</div>

        {radioValue && (
          <FormField
            control={form.control}
            name={textarea}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    //disabled={form.getValues(name)?.value === "no"}
                    placeholder={t("please_explain_and_document_every_drugs")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                {t("please_explain_and_document_every_drugs")}
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
