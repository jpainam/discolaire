"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pencil,
  X,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface TermData {
  id: number;
  name: string;
  examStartDate: string | null;
  examEndDate: string | null;
  gradeReportDate: string | null;
  status: "upcoming" | "active" | "completed";
}

interface TermRowProps {
  term: TermData;
  accentColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSave: (updated: TermData) => void;
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    dot: "bg-muted-foreground/40",
    text: "text-muted-foreground",
  },
  active: {
    label: "Active",
    dot: "bg-accent",
    text: "text-accent",
  },
  completed: {
    label: "Completed",
    dot: "bg-primary/40",
    text: "text-muted-foreground",
  },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TERM_ACCENT_COLORS: Record<number, string> = {
  1: "#3b82f6",
  2: "#0ea5e9",
  3: "#10b981",
  4: "#f59e0b",
  5: "#ef4444",
  6: "#8b5cf6",
  7: "#ec4899",
  8: "#14b8a6",
};

const INITIAL_TERMS: TermData[] = [
  {
    id: 1,
    name: "First Term",
    examStartDate: "2023-10-09",
    examEndDate: "2023-10-20",
    gradeReportDate: "2023-10-30",
    status: "completed",
  },
  {
    id: 2,
    name: "Second Term",
    examStartDate: "2024-01-15",
    examEndDate: "2024-01-26",
    gradeReportDate: "2024-02-05",
    status: "completed",
  },
  {
    id: 3,
    name: "Third Term",
    examStartDate: "2024-04-08",
    examEndDate: "2024-04-19",
    gradeReportDate: "2024-04-29",
    status: "completed",
  },
  {
    id: 4,
    name: "Fourth Term",
    examStartDate: "2024-06-24",
    examEndDate: "2024-07-05",
    gradeReportDate: "2024-07-15",
    status: "completed",
  },
  {
    id: 5,
    name: "Fifth Term",
    examStartDate: "2024-10-14",
    examEndDate: "2024-10-25",
    gradeReportDate: "2024-11-04",
    status: "completed",
  },
  {
    id: 6,
    name: "Sixth Term",
    examStartDate: "2025-01-20",
    examEndDate: "2025-01-31",
    gradeReportDate: "2025-02-10",
    status: "completed",
  },
  {
    id: 7,
    name: "Seventh Term",
    examStartDate: "2025-04-07",
    examEndDate: "2025-04-18",
    gradeReportDate: "2025-04-28",
    status: "active",
  },
  {
    id: 8,
    name: "Eighth Term",
    examStartDate: null,
    examEndDate: null,
    gradeReportDate: null,
    status: "upcoming",
  },
];

export function GradeReportSchedules() {
  const [terms, setTerms] = useState<TermData[]>(INITIAL_TERMS);
  const [expandedId, setExpandedId] = useState<number | null>(7);

  const handleSave = (updated: TermData) => {
    setTerms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const configuredCount = terms.filter(
    (t) => t.examStartDate && t.gradeReportDate,
  ).length;
  const pendingCount = terms.length - configuredCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Term Schedule Management</CardTitle>
        <CardDescription>
          Configure exam period dates and grade report availability for each
          academic term. Click a term to expand and edit.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
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
              {pendingCount} pending
            </span>
          </div>
          <div className="ml-auto">
            <div className="flex gap-1">
              {terms.map((t) => (
                <div
                  key={t.id}
                  className="h-1.5 w-5 rounded-full"
                  style={{
                    backgroundColor:
                      t.examStartDate && t.gradeReportDate
                        ? TERM_ACCENT_COLORS[t.id]
                        : "#e5e7eb",
                  }}
                  title={t.name}
                />
              ))}
            </div>
          </div>
        </div>

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
          {terms.map((term) => (
            <TermRow
              key={term.id}
              term={term}
              // @ts-expect-error TODO fix
              accentColor={TERM_ACCENT_COLORS[term.id]}
              isExpanded={expandedId === term.id}
              onToggle={() => handleToggle(term.id)}
              onSave={handleSave}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter>
        {configuredCount} of {terms.length} terms fully configured · Changes are
        saved immediately
      </CardFooter>
    </Card>
  );
}

function TermRow({
  term,
  accentColor,
  isExpanded,
  onToggle,
  onSave,
}: TermRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TermData>(term);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(term);
    setEditing(false);
  };

  const handleToggle = () => {
    if (isExpanded && editing) {
      handleCancel();
    }
    onToggle();
  };

  const s = statusConfig[term.status];
  const isConfigured = !!(term.examStartDate && term.gradeReportDate);

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border transition-shadow duration-200 hover:shadow-sm">
      {/* Row header — always visible */}
      <button
        className="group flex w-full items-center gap-4 px-5 py-4 text-left"
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
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
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)}
              />
              <span className={cn("text-xs", s.text)}>{s.label}</span>
            </div>
          </div>
        </div>

        {/* Exam dates — desktop */}
        <div className="hidden w-44 shrink-0 flex-col items-start gap-0.5 md:flex">
          <span className="text-muted-foreground text-xs">Exam period</span>
          <span
            className={cn(
              "text-sm",
              term.examStartDate
                ? "text-foreground font-medium"
                : "text-muted-foreground text-xs italic",
            )}
          >
            {term.examStartDate
              ? `${formatDate(term.examStartDate)} – ${formatDate(term.examEndDate)}`
              : "Not set"}
          </span>
        </div>

        {/* Grade report date — desktop */}
        <div className="hidden w-36 shrink-0 flex-col items-start gap-0.5 md:flex">
          <span className="text-muted-foreground text-xs">Grade reports</span>
          <span
            className={cn(
              "text-sm",
              term.gradeReportDate
                ? "text-foreground font-medium"
                : "text-muted-foreground text-xs italic",
            )}
          >
            {formatDate(term.gradeReportDate)}
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

        {/* Chevron */}
        <span className="text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="border-border border-t px-5 py-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">
              {term.name} — Schedule Details
            </h3>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil />
                Edit
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X />
                Cancel
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

              {editing ? (
                <div className="grid grid-cols-2 gap-3 pl-9">
                  <div>
                    <Label className="text-muted-foreground mb-1.5 block text-xs">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={draft.examStartDate ?? ""}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          examStartDate: e.target.value || null,
                        }))
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground mb-1.5 block text-xs">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      value={draft.examEndDate ?? ""}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          examEndDate: e.target.value || null,
                        }))
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pl-9">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Start</span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        term.examStartDate
                          ? "text-foreground"
                          : "text-muted-foreground italic",
                      )}
                    >
                      {formatDate(term.examStartDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">End</span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        term.examEndDate
                          ? "text-foreground"
                          : "text-muted-foreground italic",
                      )}
                    >
                      {formatDate(term.examEndDate)}
                    </span>
                  </div>
                </div>
              )}
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

              {editing ? (
                <div className="pl-9">
                  <Label className="text-muted-foreground mb-1.5 block text-xs">
                    Available From
                  </Label>
                  <Input
                    type="date"
                    value={draft.gradeReportDate ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        gradeReportDate: e.target.value || null,
                      }))
                    }
                    className="h-9 text-sm"
                  />
                </div>
              ) : (
                <div className="pl-9">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      Available from
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        term.gradeReportDate
                          ? "text-foreground"
                          : "text-muted-foreground italic",
                      )}
                    >
                      {formatDate(term.gradeReportDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="border-border mt-6 flex justify-end border-t pt-4">
              <Button
                size="sm"
                className="text-primary-foreground gap-2 px-5 text-sm"
                style={{ backgroundColor: accentColor }}
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
