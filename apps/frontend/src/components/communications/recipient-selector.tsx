"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import type { ClassRoom } from "./mock-data";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { cn } from "~/lib/utils";
import { ALL_STAFF, CLASSES } from "./mock-data";

// ─── Types ──────────────────────────────────────────────────────────────────
export type BroadcastMode = "broadcast" | "class-based";
export type RecipientRole =
  | "parents"
  | "teachers"
  | "students"
  | "staff"
  | "all";
export type ClassRecipientMode =
  | "all"
  | "parents"
  | "teachers"
  | "students"
  | "specific-teacher";

export interface RecipientTarget {
  mode: BroadcastMode;
  classIds: string[];
  broadcastRoles: RecipientRole[];
  classRecipientMode: ClassRecipientMode;
  specificPersonIds: string[];
}

export function getRecipientSummary(target: RecipientTarget): {
  label: string;
  count: number;
  breadcrumb: string[];
} {
  if (target.mode === "broadcast") {
    if (target.broadcastRoles.includes("all")) {
      const count =
        ALL_STAFF.length +
        CLASSES.reduce((s, c) => s + c.parentCount + c.studentCount, 0);
      return {
        label: "Everyone",
        count,
        breadcrumb: ["School-wide", "Everyone"],
      };
    }
    const parts: string[] = [];
    let count = 0;
    if (target.broadcastRoles.includes("staff")) {
      parts.push("All Staff");
      count += ALL_STAFF.length;
    }
    if (target.broadcastRoles.includes("parents")) {
      parts.push("All Parents");
      count += CLASSES.reduce((s, c) => s + c.parentCount, 0);
    }
    if (target.broadcastRoles.includes("students")) {
      parts.push("All Students");
      count += CLASSES.reduce((s, c) => s + c.studentCount, 0);
    }
    return {
      label: parts.join(", ") || "No recipients",
      count,
      breadcrumb: ["School-wide", ...parts],
    };
  }

  // Class-based
  const selectedClasses = CLASSES.filter((c) => target.classIds.includes(c.id));
  const classNames = selectedClasses.map((c) => c.name);

  if (target.classRecipientMode === "specific-teacher") {
    const people = ALL_STAFF.filter((p) =>
      target.specificPersonIds.includes(p.id),
    );
    return {
      label: people.map((p) => p.name).join(", ") || "No teachers selected",
      count: people.length,
      breadcrumb: [...classNames, people.map((p) => p.name).join(", ")],
    };
  }

  let count = 0;
  let roleLabel = "";
  if (target.classRecipientMode === "all") {
    count = selectedClasses.reduce(
      (s, c) => s + c.teachers.length + c.parentCount + c.studentCount,
      0,
    );
    roleLabel = "Everyone";
  } else if (target.classRecipientMode === "teachers") {
    count = selectedClasses.reduce((s, c) => s + c.teachers.length, 0);
    roleLabel = "Teachers";
  } else if (target.classRecipientMode === "parents") {
    count = selectedClasses.reduce((s, c) => s + c.parentCount, 0);
    roleLabel = "Parents";
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (target.classRecipientMode === "students") {
    count = selectedClasses.reduce((s, c) => s + c.studentCount, 0);
    roleLabel = "Students";
  }

  return {
    label: `${classNames.join(", ")} — ${roleLabel}`,
    count,
    breadcrumb: [...classNames, roleLabel],
  };
}

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepIndicator({
  current,
  steps,
}: {
  current: number;
  steps: string[];
}) {
  return (
    <div className="mb-5 flex items-center gap-0">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all",
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                    ? "bg-primary text-primary-foreground ring-primary/30 ring-2"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < current ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                i === current ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px w-8",
                i < current ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Mode ────────────────────────────────────────────────────────────
function StepMode({ onSelect }: { onSelect: (mode: BroadcastMode) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground mb-4 text-sm">
        How would you like to address the recipients of this message?
      </p>
      <button
        onClick={() => onSelect("class-based")}
        className="border-border hover:border-primary/50 hover:bg-primary/5 group flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all"
      >
        <div className="bg-badge-blue mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <BookOpen className="text-badge-blue-foreground h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
            By Class
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            Select one or more classes, then specify who to contact: teachers,
            parents, students, or everyone.
          </p>
        </div>
        <ChevronRight className="text-muted-foreground group-hover:text-primary mt-3 ml-auto h-4 w-4 shrink-0" />
      </button>
      <button
        onClick={() => onSelect("broadcast")}
        className="border-border hover:border-primary/50 hover:bg-primary/5 group flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all"
      >
        <div className="bg-badge-green mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Users className="text-badge-green-foreground h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
            School-wide Broadcast
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            Send to all staff, all parents, all students, or any combination
            across the whole school.
          </p>
        </div>
        <ChevronRight className="text-muted-foreground group-hover:text-primary mt-3 ml-auto h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}

// ─── Step 2a: Class Select ───────────────────────────────────────────────────
function StepClassSelect({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const grades: Record<string, ClassRoom[]> = {};
    CLASSES.forEach((c) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (!grades[c.grade]) grades[c.grade] = [];
      // @ts-expect-error TODO Later
      grades[c.grade].push(c);
    });
    return grades;
  }, []);

  const filtered = search
    ? CLASSES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground mb-2 text-sm">
        Select one or more classes. Choose recipient type in the next step.
      </p>
      <div className="relative mb-3">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>
      {selected.length > 0 && (
        <div className="bg-muted/50 mb-2 flex flex-wrap gap-1.5 rounded-md p-2">
          {selected.map((id) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const c = CLASSES.find((x) => x.id === id)!;
            return (
              <span
                key={id}
                className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              >
                {c.name}
                <button
                  onClick={() => onToggle(id)}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {(filtered
          ? [{ grade: "Results", classes: filtered }]
          : Object.entries(grouped).map(([grade, classes]) => ({
              grade,
              classes,
            }))
        ).map(({ grade, classes }) => (
          <div key={grade}>
            <p className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              {grade}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {classes.map((c) => {
                const isSelected = selected.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => onToggle(c.id)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border-2 p-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/8"
                        : "border-border hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40",
                      )}
                    >
                      {isSelected && (
                        <Check className="text-primary-foreground h-2.5 w-2.5" />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-semibold">
                        {c.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {c.teachers.length} teachers
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {c.studentCount} students
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2b: Broadcast Role Select ─────────────────────────────────────────
function StepBroadcastRole({
  selected,
  onToggle,
}: {
  selected: RecipientRole[];
  onToggle: (r: RecipientRole) => void;
}) {
  const options: {
    role: RecipientRole;
    label: string;
    desc: string;
    count: number;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      role: "staff",
      label: "All Staff",
      desc: "Teachers + admin staff",
      count: ALL_STAFF.length,
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-badge-amber-foreground bg-badge-amber",
    },
    {
      role: "parents",
      label: "All Parents",
      desc: "Parents across all classes",
      count: CLASSES.reduce((s, c) => s + c.parentCount, 0),
      icon: <Users className="h-5 w-5" />,
      color: "text-badge-green-foreground bg-badge-green",
    },
    {
      role: "students",
      label: "All Students",
      desc: "Students across all classes",
      count: CLASSES.reduce((s, c) => s + c.studentCount, 0),
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-badge-blue-foreground bg-badge-blue",
    },
    {
      role: "all",
      label: "Everyone",
      desc: "All staff, parents & students",
      count:
        ALL_STAFF.length +
        CLASSES.reduce((s, c) => s + c.parentCount + c.studentCount, 0),
      icon: <Users className="h-5 w-5" />,
      color: "text-primary-foreground bg-primary",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground mb-2 text-sm">
        Select who should receive this school-wide message. Multiple groups can
        be selected.
      </p>
      {options.map(({ role, label, desc, count, icon, color }) => {
        const isSelected = selected.includes(role);
        const isDisabled = role !== "all" && selected.includes("all");
        return (
          <button
            key={role}
            onClick={() => !isDisabled && onToggle(role)}
            disabled={isDisabled}
            className={cn(
              "flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/8"
                : isDisabled
                  ? "border-border cursor-not-allowed opacity-40"
                  : "border-border hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                color,
              )}
            >
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">{label}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
            <div className="mr-2 text-right">
              <p className="text-foreground text-sm font-bold">
                {count.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-xs">recipients</p>
            </div>
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isSelected
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/40",
              )}
            >
              {isSelected && (
                <Check className="text-primary-foreground h-3 w-3" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 3: Recipient Type for classes ─────────────────────────────────────
function StepClassRecipientType({
  selectedClassIds,
  mode,
  onModeChange,
  specificIds,
  onToggleSpecific,
}: {
  selectedClassIds: string[];
  mode: ClassRecipientMode;
  onModeChange: (m: ClassRecipientMode) => void;
  specificIds: string[];
  onToggleSpecific: (id: string) => void;
}) {
  const selectedClasses = CLASSES.filter((c) =>
    selectedClassIds.includes(c.id),
  );
  const allTeachers = selectedClasses.flatMap((c) => c.teachers);

  const topOptions: {
    value: ClassRecipientMode;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      value: "all",
      label: "Everyone",
      desc: "Teachers, parents & students",
      icon: <Users className="h-4 w-4" />,
      color: "bg-primary text-primary-foreground",
    },
    {
      value: "parents",
      label: "Parents Only",
      desc: "Parents of selected classes",
      icon: <Users className="h-4 w-4" />,
      color: "bg-badge-green text-badge-green-foreground",
    },
    {
      value: "teachers",
      label: "Teachers Only",
      desc: "All teachers of selected classes",
      icon: <UserCheck className="h-4 w-4" />,
      color: "bg-badge-amber text-badge-amber-foreground",
    },
    {
      value: "students",
      label: "Students Only",
      desc: "Students in selected classes",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "bg-badge-blue text-badge-blue-foreground",
    },
    {
      value: "specific-teacher",
      label: "Specific Teacher(s)",
      desc: "Choose individual teachers",
      icon: <UserCheck className="h-4 w-4" />,
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground mb-2 text-sm">
        Sending to:{" "}
        <span className="text-foreground font-medium">
          {selectedClasses.map((c) => c.name).join(", ")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topOptions.map(({ value, label, desc, icon, color }) => (
          <button
            key={value}
            onClick={() => onModeChange(value)}
            className={cn(
              "flex items-start gap-2.5 rounded-lg border-2 p-3 text-left transition-all",
              mode === value
                ? "border-primary bg-primary/8"
                : "border-border hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                color,
              )}
            >
              {icon}
            </div>
            <div>
              <p className="text-foreground text-xs font-semibold">{label}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          </button>
        ))}
      </div>
      {mode === "specific-teacher" && (
        <div className="bg-muted/50 border-border mt-2 space-y-2 rounded-lg border p-3">
          <p className="text-foreground mb-2 text-xs font-semibold">
            Select teachers:
          </p>
          {allTeachers.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No teachers found for selected classes.
            </p>
          ) : (
            allTeachers.map((t) => {
              const isSelected = specificIds.includes(t.id);
              const cls = selectedClasses.find((c) => c.id === t.classId);
              return (
                <button
                  key={t.id}
                  onClick={() => onToggleSpecific(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-2.5 transition-all",
                    isSelected
                      ? "border-primary bg-primary/8"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && (
                      <Check className="text-primary-foreground h-2.5 w-2.5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-foreground text-xs font-medium">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {cls?.name} · {t.email}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Recipient Selector ─────────────────────────────────────────────────
type SelectorStep = "mode" | "class-select" | "recipient-type";

interface RecipientSelectorProps {
  initialTarget?: RecipientTarget | null;
  onConfirm: (target: RecipientTarget) => void;
}

export default function RecipientSelector({
  initialTarget,
  onConfirm,
}: RecipientSelectorProps) {
  const [step, setStep] = useState<SelectorStep>(
    initialTarget
      ? initialTarget.mode === "class-based"
        ? "recipient-type"
        : "recipient-type"
      : "mode",
  );
  const { closeModal } = useModal();
  const [broadcastMode, setBroadcastMode] = useState<BroadcastMode | null>(
    initialTarget?.mode ?? null,
  );
  const [classIds, setClassIds] = useState<string[]>(
    initialTarget?.classIds ?? [],
  );
  const [broadcastRoles, setBroadcastRoles] = useState<RecipientRole[]>(
    initialTarget?.broadcastRoles ?? [],
  );
  const [classRecipientMode, setClassRecipientMode] =
    useState<ClassRecipientMode>(initialTarget?.classRecipientMode ?? "all");
  const [specificPersonIds, setSpecificPersonIds] = useState<string[]>(
    initialTarget?.specificPersonIds ?? [],
  );

  const STEPS_CLASS = ["Mode", "Classes", "Recipients"];
  const STEPS_BROADCAST = ["Mode", "Recipients"];

  const currentStepIndex = useMemo(() => {
    if (broadcastMode === "broadcast") return step === "mode" ? 0 : 1;
    return step === "mode" ? 0 : step === "class-select" ? 1 : 2;
  }, [step, broadcastMode]);

  function handleModeSelect(mode: BroadcastMode) {
    setBroadcastMode(mode);
    setStep(mode === "class-based" ? "class-select" : "recipient-type");
  }

  function handleClassToggle(id: string) {
    setClassIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleBroadcastRoleToggle(role: RecipientRole) {
    setBroadcastRoles((prev) => {
      if (role === "all") return prev.includes("all") ? [] : ["all"];
      const without = prev.filter((r) => r !== role && r !== "all");
      return prev.includes(role) ? without : [...without, role];
    });
  }

  function handleSpecificToggle(id: string) {
    setSpecificPersonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function canProceed(): boolean {
    if (step === "class-select") return classIds.length > 0;
    if (step === "recipient-type" && broadcastMode === "broadcast")
      return broadcastRoles.length > 0;
    if (step === "recipient-type" && broadcastMode === "class-based") {
      if (classRecipientMode === "specific-teacher")
        return specificPersonIds.length > 0;
      return true;
    }
    return false;
  }

  function handleNext() {
    if (step === "class-select") {
      setStep("recipient-type");
      return;
    }
    if (step === "recipient-type") {
      onConfirm({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mode: broadcastMode!,
        classIds,
        broadcastRoles,
        classRecipientMode,
        specificPersonIds,
      });
    }
  }

  function handleBack() {
    if (
      step === "class-select" ||
      (step === "recipient-type" && broadcastMode === "broadcast")
    ) {
      setStep("mode");
      setBroadcastMode(null);
    } else if (step === "recipient-type" && broadcastMode === "class-based") {
      setStep("class-select");
    }
  }

  const steps = broadcastMode === "broadcast" ? STEPS_BROADCAST : STEPS_CLASS;
  const isLastStep = step === "recipient-type";

  return (
    <div className="bg-foreground/30 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border-border flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-foreground text-base font-semibold">
              Select Recipients
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {step === "mode" && "Choose how to target recipients"}
              {step === "class-select" && "Select one or more classes"}
              {step === "recipient-type" &&
                (broadcastMode === "broadcast"
                  ? "Choose recipient groups"
                  : "Choose recipient type")}
            </p>
          </div>
          <button
            onClick={() => {
              closeModal();
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {broadcastMode && (
            <StepIndicator current={currentStepIndex} steps={steps} />
          )}
          {step === "mode" && <StepMode onSelect={handleModeSelect} />}
          {step === "class-select" && (
            <StepClassSelect selected={classIds} onToggle={handleClassToggle} />
          )}
          {step === "recipient-type" && broadcastMode === "broadcast" && (
            <StepBroadcastRole
              selected={broadcastRoles}
              onToggle={handleBroadcastRoleToggle}
            />
          )}
          {step === "recipient-type" && broadcastMode === "class-based" && (
            <StepClassRecipientType
              selectedClassIds={classIds}
              mode={classRecipientMode}
              onModeChange={(m) => {
                setClassRecipientMode(m);
                setSpecificPersonIds([]);
              }}
              specificIds={specificPersonIds}
              onToggleSpecific={handleSpecificToggle}
            />
          )}
        </div>

        {/* Footer */}
        {step !== "mode" && (
          <>
            <Separator />
            <div className="flex items-center justify-between px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                {isLastStep ? (
                  "Confirm Recipients"
                ) : (
                  <>
                    Continue <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
