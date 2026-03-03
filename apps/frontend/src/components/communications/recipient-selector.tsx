"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  /** Populated at confirmation time by the selector. */
  resolvedCount: number;
  resolvedLabel: string;
  breadcrumb: string[];
}

// ─── Server-side classroom / staff shapes ────────────────────────────────────

type ClassroomData = {
  id: string;
  name: string;
  grade: string;
  teachers: { id: string; name: string; email: string }[];
  studentCount: number;
  parentCount: number;
};

type StaffData = {
  id: string;
  name: string;
  email: string;
  isTeacher: boolean;
};

// ─── Summary helper ───────────────────────────────────────────────────────────

export function getRecipientSummary(target: RecipientTarget): {
  label: string;
  count: number;
  breadcrumb: string[];
} {
  return {
    label: target.resolvedLabel,
    count: target.resolvedCount,
    breadcrumb: target.breadcrumb,
  };
}

// ─── Count helpers ────────────────────────────────────────────────────────────

function computeCount(
  target: Pick<
    RecipientTarget,
    | "mode"
    | "classIds"
    | "broadcastRoles"
    | "classRecipientMode"
    | "specificPersonIds"
  >,
  classrooms: ClassroomData[],
  staff: StaffData[],
): { count: number; label: string; breadcrumb: string[] } {
  const seen = new Set<string>();

  function countUnique(emails: (string | undefined | null)[]) {
    let n = 0;
    for (const e of emails) {
      if (e && !seen.has(e)) {
        seen.add(e);
        n++;
      }
    }
    return n;
  }

  if (target.mode === "broadcast") {
    const roles = target.broadcastRoles;
    const all = roles.includes("all");
    const parts: string[] = [];
    let count = 0;

    if (all || roles.includes("parents")) {
      const n = countUnique(
        classrooms.flatMap(() => Array(0).fill("")), // parents resolved server-side
      );
      // Approximate from classroom parent counts
      const parentEmails = new Set<string>();
      classrooms.forEach((c) => {
        // We don't have individual parent emails client-side; use parentCount as proxy
        for (let i = 0; i < c.parentCount; i++) {
          parentEmails.add(`__parent_${c.id}_${i}`);
        }
      });
      const parentCount = parentEmails.size;
      count += parentCount;
      parts.push("All Parents");
      void n;
    }
    if (all || roles.includes("staff") || roles.includes("teachers")) {
      count += countUnique(staff.map((s) => s.email));
      parts.push("All Staff");
    }
    if (all || roles.includes("students")) {
      let studentCount = 0;
      classrooms.forEach((c) => {
        studentCount += c.studentCount;
      });
      count += studentCount;
      parts.push("All Students");
    }

    const label = parts.join(", ") || "No recipients";
    return { count, label, breadcrumb: ["School-wide", ...parts] };
  }

  // class-based
  const selectedClasses = classrooms.filter((c) =>
    target.classIds.includes(c.id),
  );
  const classNames = selectedClasses.map((c) => c.name);

  if (target.classRecipientMode === "specific-teacher") {
    const people = staff.filter((s) =>
      target.specificPersonIds.includes(s.id),
    );
    const label =
      people.map((p) => p.name).join(", ") || "No teachers selected";
    return {
      count: people.length,
      label,
      breadcrumb: [...classNames, label],
    };
  }

  let count = 0;
  let roleLabel = "";

  if (target.classRecipientMode === "all") {
    const teacherEmails = new Set<string>();
    selectedClasses.forEach((c) => {
      c.teachers.forEach((t) => teacherEmails.add(t.email));
    });
    const parentCount = selectedClasses.reduce(
      (s, c) => s + c.parentCount,
      0,
    );
    const studentCount = selectedClasses.reduce(
      (s, c) => s + c.studentCount,
      0,
    );
    count = teacherEmails.size + parentCount + studentCount;
    roleLabel = "Everyone";
  } else if (target.classRecipientMode === "teachers") {
    const teacherEmails = new Set<string>();
    selectedClasses.forEach((c) =>
      c.teachers.forEach((t) => teacherEmails.add(t.email)),
    );
    count = teacherEmails.size;
    roleLabel = "Teachers";
  } else if (target.classRecipientMode === "parents") {
    count = selectedClasses.reduce((s, c) => s + c.parentCount, 0);
    roleLabel = "Parents";
  } else if (target.classRecipientMode === "students") {
    count = selectedClasses.reduce((s, c) => s + c.studentCount, 0);
    roleLabel = "Students";
  }

  return {
    count,
    label: `${classNames.join(", ")} — ${roleLabel}`,
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
  classrooms,
  selected,
  onToggle,
}: {
  classrooms: ClassroomData[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const grades: Record<string, ClassroomData[]> = {};
    classrooms.forEach((c) => {
      if (!grades[c.grade]) grades[c.grade] = [];
      grades[c.grade]!.push(c);
    });
    return grades;
  }, [classrooms]);

  const filtered = search
    ? classrooms.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
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
            const c = classrooms.find((x) => x.id === id);
            if (!c) return null;
            return (
              <span
                key={id}
                className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              >
                {c.name}
                <button onClick={() => onToggle(id)} className="hover:opacity-70">
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
  classrooms,
  staff,
  selected,
  onToggle,
}: {
  classrooms: ClassroomData[];
  staff: StaffData[];
  selected: RecipientRole[];
  onToggle: (r: RecipientRole) => void;
}) {
  const totalParents = classrooms.reduce((s, c) => s + c.parentCount, 0);
  const totalStudents = classrooms.reduce((s, c) => s + c.studentCount, 0);
  const totalStaff = staff.length;

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
      count: totalStaff,
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-badge-amber-foreground bg-badge-amber",
    },
    {
      role: "parents",
      label: "All Parents",
      desc: "Parents across all classes",
      count: totalParents,
      icon: <Users className="h-5 w-5" />,
      color: "text-badge-green-foreground bg-badge-green",
    },
    {
      role: "students",
      label: "All Students",
      desc: "Students across all classes",
      count: totalStudents,
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-badge-blue-foreground bg-badge-blue",
    },
    {
      role: "all",
      label: "Everyone",
      desc: "All staff, parents & students",
      count: totalStaff + totalParents + totalStudents,
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
  classrooms,
  staff,
  selectedClassIds,
  mode,
  onModeChange,
  specificIds,
  onToggleSpecific,
}: {
  classrooms: ClassroomData[];
  staff: StaffData[];
  selectedClassIds: string[];
  mode: ClassRecipientMode;
  onModeChange: (m: ClassRecipientMode) => void;
  specificIds: string[];
  onToggleSpecific: (id: string) => void;
}) {
  const selectedClasses = classrooms.filter((c) =>
    selectedClassIds.includes(c.id),
  );

  // Teachers who teach in selected classrooms
  const classTeacherIds = new Set(
    selectedClasses.flatMap((c) => c.teachers.map((t) => t.id)),
  );
  const classTeachers = staff.filter((s) => classTeacherIds.has(s.id));

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
          {classTeachers.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No teachers found for selected classes.
            </p>
          ) : (
            classTeachers.map((t) => {
              const isSelected = specificIds.includes(t.id);
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
                    <p className="text-muted-foreground text-xs">{t.email}</p>
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
  const trpc = useTRPC();

  const { data: classrooms = [], isLoading: classroomsLoading } = useQuery(
    trpc.bulkEmail.listClassrooms.queryOptions(),
  );
  const { data: staff = [], isLoading: staffLoading } = useQuery(
    trpc.bulkEmail.listStaff.queryOptions(),
  );
  const isLoading = classroomsLoading || staffLoading;

  const [step, setStep] = useState<SelectorStep>(
    initialTarget ? "recipient-type" : "mode",
  );
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
      const partialTarget = {
        mode: broadcastMode!,
        classIds,
        broadcastRoles,
        classRecipientMode,
        specificPersonIds,
      };
      const { count, label, breadcrumb } = computeCount(
        partialTarget,
        classrooms,
        staff,
      );
      onConfirm({
        ...partialTarget,
        resolvedCount: count,
        resolvedLabel: label,
        breadcrumb,
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
    <div className="flex max-h-[85vh] flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border flex items-center border-b px-6 py-4">
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
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {isLoading && (
          <div className="text-muted-foreground py-8 text-center text-sm">
            Loading...
          </div>
        )}
        {!isLoading && (
          <>
            {broadcastMode && (
              <StepIndicator current={currentStepIndex} steps={steps} />
            )}
            {step === "mode" && <StepMode onSelect={handleModeSelect} />}
            {step === "class-select" && (
              <StepClassSelect
                classrooms={classrooms}
                selected={classIds}
                onToggle={handleClassToggle}
              />
            )}
            {step === "recipient-type" && broadcastMode === "broadcast" && (
              <StepBroadcastRole
                classrooms={classrooms}
                staff={staff}
                selected={broadcastRoles}
                onToggle={handleBroadcastRoleToggle}
              />
            )}
            {step === "recipient-type" && broadcastMode === "class-based" && (
              <StepClassRecipientType
                classrooms={classrooms}
                staff={staff}
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
          </>
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
              disabled={!canProceed() || isLoading}
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
  );
}
