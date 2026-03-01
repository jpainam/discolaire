"use client";

import {
  Activity,
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  FileEdit,
  UserPlus,
} from "lucide-react";

import { cn } from "~/lib/utils";

interface ActivityItem {
  id: number;
  type: "enrollment" | "grade" | "edit" | "alert" | "check";
  message: string;
  user: string;
  time: string;
  unread?: boolean;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    type: "enrollment",
    message: "Nouvel élève inscrit en Sixième M2",
    user: "Admin",
    time: "Il y a 5 min",
    unread: true,
  },
  {
    id: 2,
    type: "grade",
    message: "Notes de Géographie saisies pour Première CG",
    user: "M. Dupont",
    time: "Il y a 18 min",
    unread: true,
  },
  {
    id: 3,
    type: "edit",
    message: "Fiche de TCHAPTCHET Lima mise à jour",
    user: "Secrétariat",
    time: "Il y a 34 min",
  },
  {
    id: 4,
    type: "check",
    message: "Présences validées — Terminale Esp. 2",
    user: "Prof. Mba",
    time: "Il y a 1h",
  },
  {
    id: 5,
    type: "alert",
    message: "Absence non justifiée — ONDOA Mveng J.",
    user: "Système",
    time: "Il y a 2h",
  },
  {
    id: 6,
    type: "enrollment",
    message: "Inscription confirmée — BATA Mamiah K.",
    user: "Admin",
    time: "Il y a 3h",
  },
  {
    id: 7,
    type: "grade",
    message: "Bulletin trimestriel généré — Classe 5M1",
    user: "Système",
    time: "Hier",
  },
];

const iconMap = {
  enrollment: { icon: UserPlus, bg: "bg-primary/10", color: "text-primary" },
  grade: { icon: BookOpen, bg: "bg-amber-100", color: "text-amber-600" },
  edit: { icon: FileEdit, bg: "bg-sky-100", color: "text-sky-600" },
  alert: { icon: AlertCircle, bg: "bg-red-100", color: "text-red-500" },
  check: { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600" },
};

export function RecentActivitiesDashboard() {
  const unreadCount = activities.filter((a) => a.unread).length;

  return (
    <div className="bg-card border-border flex h-full flex-col rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-muted-foreground h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">
            Activités récentes
          </h2>
        </div>
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="-mx-1 flex-1 space-y-0.5 overflow-y-auto">
        {activities.map((item, idx) => {
          const { icon: Icon, bg, color } = iconMap[item.type];
          return (
            <div
              key={item.id}
              className={cn(
                "hover:bg-muted/60 relative flex cursor-pointer gap-2.5 rounded-lg px-2 py-2 transition-colors",
                item.unread && "bg-primary/5",
              )}
            >
              {/* Timeline line */}
              {idx < activities.length - 1 && (
                <div className="bg-border absolute top-9 bottom-0 left-[22px] z-0 w-px" />
              )}
              <div
                className={cn(
                  "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  bg,
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-[11px] leading-relaxed">
                  {item.message}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[10px] font-medium">
                    {item.user}
                  </span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    ·
                  </span>
                  <Clock className="text-muted-foreground/60 h-2.5 w-2.5" />
                  <span className="text-muted-foreground/60 text-[10px]">
                    {item.time}
                  </span>
                </div>
              </div>
              {item.unread && (
                <div className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      <button className="text-primary border-border mt-3 w-full border-t pt-2 text-center text-xs font-medium hover:underline">
        Voir toutes les activités →
      </button>
    </div>
  );
}
