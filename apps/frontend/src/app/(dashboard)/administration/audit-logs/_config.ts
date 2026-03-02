import type { ComponentType } from "react";

import {
  DeleteIcon,
  EditIcon,
  EnrollmentIcon,
  FileIcon,
  FilesIcon,
  LockIcon,
  LogoutIcon,
  PlusIcon,
} from "~/icons";

type AppIcon = ComponentType<{ className?: string }>;

export interface ActionConfig {
  icon: AppIcon;
  iconBg: string;
  iconColor: string;
  label: string;
}

export const ACTION_CONFIG: Record<string, ActionConfig> = {
  create: {
    icon: PlusIcon,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    label: "Création",
  },
  update: {
    icon: EditIcon,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    label: "Modification",
  },
  delete: {
    icon: DeleteIcon,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    label: "Suppression",
  },
  deleted: {
    icon: DeleteIcon,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    label: "Suppression",
  },
  enrolled: {
    icon: EnrollmentIcon,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
    label: "Inscription",
  },
  unenrolled: {
    icon: LogoutIcon,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    label: "Désinscription",
  },
  uploaded: {
    icon: FileIcon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    label: "Téléversement",
  },
  downloaded: {
    icon: FilesIcon,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    label: "Téléchargement",
  },
  disabled: {
    icon: LockIcon,
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-500",
    label: "Désactivation",
  },
};

export const FALLBACK_ACTION: ActionConfig = {
  icon: EditIcon,
  iconBg: "bg-muted/10",
  iconColor: "text-muted-foreground",
  label: "Autre",
};

/** All distinct action options shown in the filter sidebar (deduped). */
export const ALL_ACTIONS = [
  "create",
  "update",
  "delete",
  "enrolled",
  "unenrolled",
  "uploaded",
  "downloaded",
  "disabled",
] as const;

export const TARGET_TYPE_LABELS: Record<string, string> = {
  student: "Élève",
  staff: "Personnel",
  contact: "Contact",
  classroom: "Classe",
  document: "Document",
  user: "Utilisateur",
  permission: "Permission",
  transaction: "Transaction",
};

export const ALL_TARGET_TYPES = Object.keys(TARGET_TYPE_LABELS);

// ─── Date helpers ──────────────────────────────────────────────────────────────

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function dateGroupLabel(d: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (stripTime(d) === stripTime(today)) return "Aujourd'hui";
  if (stripTime(d) === stripTime(yesterday)) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function relativeTime(date: Date, locale: string): string {
  const diffSec = (date.getTime() - Date.now()) / 1000;
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSec) >= seconds || unit === "second") {
      return fmt.format(Math.round(diffSec / seconds), unit);
    }
  }
  return "";
}

export function fromDateForRange(
  range: "today" | "7d" | "30d" | "all",
): Date | undefined {
  const now = new Date();
  // Base all ranges on midnight so the timestamp is stable within a day.
  // This ensures the server prefetch key matches the client query key exactly.
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "today") return midnight;
  if (range === "7d") return new Date(midnight.getTime() - 7 * 86_400_000);
  if (range === "30d") return new Date(midnight.getTime() - 30 * 86_400_000);
  return undefined;
}
