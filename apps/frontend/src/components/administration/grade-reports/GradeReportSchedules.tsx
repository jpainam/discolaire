"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, ClipboardList, X } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
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

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
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

  return (
    <Card className="rounded-none bg-transparent ring-0">
      <CardHeader>
        <CardTitle>Term TermReportConfig Management</CardTitle>
        <CardDescription>
          Configure exam period dates and grade report availability for each
          academic term. Click a term to expand and edit.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {!isPending && (
          <div className="border-border flex items-center gap-6 rounded-xl border p-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/50 h-2.5 w-2.5 shrink-0 rounded-full" />
              <span className="text-foreground text-sm font-medium">
                {configuredCount} configured
              </span>
            </div>
            <div className="bg-border h-4 w-px" />
            <div className="flex items-center gap-2">
              <span className="bg-muted-foreground/30 h-2.5 w-2.5 shrink-0 rounded-full" />
              <span className="text-muted-foreground text-sm">
                {terms.length - configuredCount} pending
              </span>
            </div>
            <div className="ml-auto">
              <div className="flex gap-1">
                {terms.map((t, i) => {
                  const s = scheduleByTermId.get(t.id);
                  const isConfigured = !!(
                    s?.examStartDate && s.resultPublishedAt
                  );
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
        )}

        {/* Column headers — desktop only */}
        <div className="mb-2 hidden grid-cols-[1fr_176px_144px_108px_20px] gap-4 px-5 md:grid">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Term
          </span>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Exam Period
          </span>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Grade Reports
          </span>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Status
          </span>
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
      </CardContent>

      {!isPending && (
        <CardFooter>
          {configuredCount} of {terms.length} terms fully configured · Changes
          are saved immediately
        </CardFooter>
      )}
    </Card>
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

  const isConfigured = !!(
    schedule?.examStartDate && schedule.resultPublishedAt
  );
  const isActive = term.isActive;

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
  const statusDot = isActive ? "bg-accent" : "bg-muted-foreground/40";
  const statusText = isActive ? "text-accent" : "text-muted-foreground";

  return (
    <Accordion
      type="single"
      collapsible
      //className="border-border bg-card rounded-xl border transition-shadow duration-200 hover:shadow-sm"
    >
      <AccordionItem value="schedule" className="data-open:bg-transparent">
        <AccordionTrigger className="items-center gap-4 px-5 py-4 hover:no-underline">
          {/* Accent indicator */}
          <div
            className="h-8 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          {/* Term name + status */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {term.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDot)}
                />
                <span className={cn("text-xs", statusText)}>{statusLabel}</span>
              </div>
            </div>
          </div>

          {/* Exam dates — desktop */}
          <div className="hidden w-44 shrink-0 flex-col items-start gap-0.5 md:flex">
            <span className="text-muted-foreground text-xs">Exam period</span>
            <span
              className={cn(
                "text-sm",
                schedule?.examStartDate
                  ? "text-foreground font-medium"
                  : "text-muted-foreground text-xs italic",
              )}
            >
              {schedule?.examStartDate
                ? `${formatDate(schedule.examStartDate)} – ${formatDate(schedule.examEndDate)}`
                : "Not set"}
            </span>
          </div>

          {/* Grade report date — desktop */}
          <div className="hidden w-36 shrink-0 flex-col items-start gap-0.5 md:flex">
            <span className="text-muted-foreground text-xs">Grade reports</span>
            <span
              className={cn(
                "text-sm",
                schedule?.resultPublishedAt
                  ? "text-foreground font-medium"
                  : "text-muted-foreground text-xs italic",
              )}
            >
              {formatDate(schedule?.resultPublishedAt)}
            </span>
          </div>

          {/* Configured pill */}
          <div className="hidden shrink-0 items-center sm:flex">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                isConfigured
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isConfigured ? "Configured" : "Pending"}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-border -mx-2 border-t px-5 py-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">
              {term.name} — TermReportConfig Details
            </h3>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Exam period */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <CalendarDays
                      className="h-3.5 w-3.5"
                      style={{ color: accentColor }}
                    />
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    Exam Period
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pl-9">
                  <form.Field name="examStartDate">
                    {(field) => (
                      <Field>
                        <FieldLabel className="text-muted-foreground mb-1.5 text-xs">
                          Start Date
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
                        <FieldLabel className="text-muted-foreground mb-1.5 text-xs">
                          End Date
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
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <ClipboardList
                      className="h-3.5 w-3.5"
                      style={{ color: accentColor }}
                    />
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    Grade Report Availability
                  </span>
                </div>

                <div className="pl-9">
                  <form.Field name="resultPublishedAt">
                    {(field) => (
                      <Field>
                        <FieldLabel className="text-muted-foreground mb-1.5 text-xs">
                          Available From
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

            <div className="border-border mt-6 flex justify-end border-t pt-4">
              <form.Subscribe selector={(s) => s.isDirty}>
                {(isDirty) => (
                  <>
                    {isDirty && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => form.reset()}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!isDirty || upsertMutation.isPending}
                      className="text-primary-foreground gap-2 px-5 text-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Check className="h-4 w-4" />
                      Save Changes
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
