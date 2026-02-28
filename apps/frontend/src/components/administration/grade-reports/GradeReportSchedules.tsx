"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, ClipboardList, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { DatePicker } from "~/components/DatePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

type Term = RouterOutputs["term"]["all"][number];
type TermReportConfig = RouterOutputs["termReportConfig"]["all"][number];

const TERM_ACCENT_COLORS = [
  "#3b82f6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function formatDate(date: Date | null | undefined, locale = "en-US"): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getAccentColor(index: number): string {
  return TERM_ACCENT_COLORS[index % TERM_ACCENT_COLORS.length] ?? "#3b82f6";
}

export function GradeReportSchedules() {
  const trpc = useTRPC();
  const { data: terms = [], isPending: termsLoading } = useQuery(
    trpc.term.all.queryOptions(),
  );
  const { data: schedules = [], isPending: schedulesLoading } = useQuery(
    trpc.termReportConfig.all.queryOptions(),
  );

  const scheduleByTermId = new Map<string, TermReportConfig>(
    schedules.map((s) => [s.termId, s]),
  );

  const configuredCount = terms.filter((t) => {
    const s = scheduleByTermId.get(t.id);
    return s?.examStartDate && s.resultPublishedAt;
  }).length;

  const isPending = termsLoading || schedulesLoading;
  const t = useTranslations();

  if (isPending) {
    return <TableSkeleton rows={8} cols={3} />;
  }

  return (
    <div className="ga flex flex-col gap-2 px-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Label>{t("schedules")}</Label>
          <div className="text-muted-foreground text-xs">
            Configurer les dates d'examens et de la disponibilités des
            bulletins.
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={"secondary"}
            onClick={() =>
              window.open(
                "/api/pdfs/gradereports/schedules?format=pdf",
                "_blank",
              )
            }
          >
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              const a = document.createElement("a");
              a.href = "/api/pdfs/gradereports/schedules?format=csv";
              a.click();
            }}
          >
            <XMLIcon />
            {t("xml_export")}
          </Button>
        </div>
      </div>

      <div className="border-border flex items-center gap-6 rounded-lg border p-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary/50 h-2.5 w-2.5 shrink-0 rounded-full" />
          <Label className="font-medium">{configuredCount} configuré(s)</Label>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center gap-2">
          <span className="bg-muted-foreground/30 h-2.5 w-2.5 shrink-0 rounded-full" />
          <Label className="text-muted-foreground lowercase">
            {terms.length - configuredCount} {t("pending")}
          </Label>
        </div>
        <div className="ml-auto">
          <div className="flex gap-1">
            {terms.map((t, i) => {
              const s = scheduleByTermId.get(t.id);
              const isConfigured = !!(s?.examStartDate && s.resultPublishedAt);
              return (
                <div
                  key={t.id}
                  className="h-1.5 w-5 rounded-full"
                  style={{
                    backgroundColor: isConfigured
                      ? getAccentColor(i)
                      : "#e5e7eb",
                  }}
                  title={t.name}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Term rows */}
      <div className="space-y-2">
        {terms.map((term, index) => (
          <TermRow
            key={term.id}
            term={term}
            schedule={scheduleByTermId.get(term.id)}
            accentColor={getAccentColor(index)}
          />
        ))}
      </div>

      <div className="text-muted-foreground text-xs">
        {configuredCount} sur {terms.length} périodes ont été configuré(s).
      </div>
    </div>
  );
}

interface TermRowProps {
  term: Term;
  schedule: TermReportConfig | undefined;
  accentColor: string;
}

function TermRow({ term, schedule, accentColor }: TermRowProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const locale = useLocale();

  const isConfigured = !!(
    schedule?.examStartDate && schedule.resultPublishedAt
  );
  const isActive = term.isActive;
  const t = useTranslations();

  const form = useForm({
    defaultValues: {
      examStartDate: schedule?.examStartDate
        ? new Date(schedule.examStartDate)
        : undefined,
      examEndDate: schedule?.examEndDate
        ? new Date(schedule.examEndDate)
        : undefined,
      resultPublishedAt: schedule?.resultPublishedAt
        ? new Date(schedule.resultPublishedAt)
        : undefined,
    },
    onSubmit: ({ value }) => {
      toast.loading("Saving…", { id: term.id });
      upsertMutation.mutate({
        termId: term.id,
        examStartDate: value.examStartDate ?? null,
        examEndDate: value.examEndDate ?? null,
        resultPublishedAt: value.resultPublishedAt ?? null,
      });
    },
  });

  const upsertMutation = useMutation(
    trpc.termReportConfig.upsert.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.termReportConfig.all.pathFilter(),
        );
        toast.success("Saved", { id: term.id });
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message, { id: term.id });
      },
    }),
  );

  const statusLabel = isActive ? "Active" : "Inactive";

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="schedule">
        <AccordionTrigger className="items-center gap-4 px-4 hover:no-underline">
          <div
            className="h-8 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Label>{term.name}</Label>
            <Badge
              variant={term.isActive ? "success" : "destructive"}
              size={"xs"}
              appearance={"light"}
              className="w-fit"
            >
              {/* <DotIcon /> */}
              {statusLabel}
            </Badge>
          </div>

          <div className="hidden w-96 shrink-0 flex-col items-start gap-2 md:flex">
            <Label>Pérides des examens</Label>
            <Label
              className={cn(
                schedule?.examStartDate
                  ? "font-medium"
                  : "text-muted-foreground text-xs italic",
              )}
            >
              {schedule?.examStartDate
                ? `${formatDate(schedule.examStartDate, locale)} - ${formatDate(schedule.examEndDate, locale)}`
                : "Not set"}
            </Label>
          </div>

          {/* Grade report date — desktop */}
          <div className="hidden w-56 shrink-0 flex-col items-start gap-2 md:flex">
            <Label>Publication des bulletins</Label>
            <Label
              className={cn(
                schedule?.resultPublishedAt
                  ? "font-medium"
                  : "text-muted-foreground text-xs italic",
              )}
            >
              {formatDate(schedule?.resultPublishedAt)}
            </Label>
          </div>

          <Badge
            appearance={"light"}
            size={"sm"}
            variant={isConfigured ? "warning" : "secondary"}
          >
            {isConfigured ? "Configured" : "Pending"}
          </Badge>
        </AccordionTrigger>

        <AccordionContent className="border-border -mx-2 flex flex-col gap-4 border-t px-4 py-4">
          <Label className="font-semibold">
            {term.name} - Configurer les détails
          </Label>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <CalendarDays
                      className="size-3"
                      style={{ color: accentColor }}
                    />
                  </div>
                  <Label>Période des examens</Label>
                </div>

                <div className="grid grid-cols-2 gap-4 pl-9">
                  <form.Field name="examStartDate">
                    {(field) => (
                      <Field>
                        <FieldLabel className="text-muted-foreground">
                          {t("Start date")}
                        </FieldLabel>
                        <DatePicker
                          defaultValue={field.state.value}
                          onSelectAction={(date) => field.handleChange(date)}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="examEndDate">
                    {(field) => (
                      <Field>
                        <FieldLabel className="text-muted-foreground">
                          {t("End date")}
                        </FieldLabel>
                        <DatePicker
                          defaultValue={field.state.value}
                          onSelectAction={(date) => field.handleChange(date)}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Grade report */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <ClipboardList
                      className="size-3"
                      style={{ color: accentColor }}
                    />
                  </div>
                  <Label className="font-semibold">
                    Publication des bulletins
                  </Label>
                </div>

                <div className="pl-9">
                  <form.Field name="resultPublishedAt">
                    {(field) => (
                      <Field>
                        <FieldLabel className="text-muted-foreground">
                          Disponible à partir de
                        </FieldLabel>
                        <DatePicker
                          defaultValue={field.state.value}
                          onSelectAction={(date) => field.handleChange(date)}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>
              </div>
            </FieldGroup>
            <Separator className="my-2" />

            <div className="flex justify-end">
              <form.Subscribe selector={(s) => s.isDirty}>
                {(isDirty) => (
                  <>
                    {isDirty && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => form.reset()}
                      >
                        <X />
                        {t("cancel")}
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={!isDirty || upsertMutation.isPending}
                      style={{ backgroundColor: accentColor }}
                    >
                      <Check />
                      {t("submit")}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
