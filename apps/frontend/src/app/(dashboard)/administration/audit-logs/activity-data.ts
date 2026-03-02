"use client";

import type { Activity } from "lucide-react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileEdit,
  UserPlus,
} from "lucide-react";

export type ActivityType = "enrollment" | "grade" | "edit" | "alert" | "check";

export interface ActivityItem {
  id: number;
  type: ActivityType;
  message: string;
  user: string;
  time: string;
  date: string; // ISO string for filtering
  unread?: boolean;
  category: "inscription" | "notes" | "modification" | "absence" | "validation";
}

export const allActivities: ActivityItem[] = [
  {
    id: 1,
    type: "enrollment",
    message: "Nouvel élève inscrit en Sixième M2",
    user: "Admin",
    time: "Il y a 5 min",
    date: "2026-03-01",
    unread: true,
    category: "inscription",
  },
  {
    id: 2,
    type: "grade",
    message: "Notes de Géographie saisies pour Première CG",
    user: "M. Dupont",
    time: "Il y a 18 min",
    date: "2026-03-01",
    unread: true,
    category: "notes",
  },
  {
    id: 3,
    type: "edit",
    message: "Fiche de TCHAPTCHET Lima mise à jour",
    user: "Secrétariat",
    time: "Il y a 34 min",
    date: "2026-03-01",
    category: "modification",
  },
  {
    id: 4,
    type: "check",
    message: "Présences validées — Terminale Espagnol 2",
    user: "Prof. Mba",
    time: "Il y a 1h",
    date: "2026-03-01",
    category: "validation",
  },
  {
    id: 5,
    type: "alert",
    message: "Absence non justifiée — ONDOA Mveng Johnson",
    user: "Système",
    time: "Il y a 2h",
    date: "2026-03-01",
    category: "absence",
  },
  {
    id: 6,
    type: "enrollment",
    message: "Inscription confirmée — BATA Mamiah Kenneth",
    user: "Admin",
    time: "Il y a 3h",
    date: "2026-03-01",
    category: "inscription",
  },
  {
    id: 7,
    type: "grade",
    message: "Bulletin trimestriel généré — Classe 5M1",
    user: "Système",
    time: "Hier, 15h22",
    date: "2026-02-29",
    category: "notes",
  },
  {
    id: 8,
    type: "check",
    message: "Présences validées — Seconde C1",
    user: "Prof. Ngono",
    time: "Hier, 12h10",
    date: "2026-02-29",
    category: "validation",
  },
  {
    id: 9,
    type: "alert",
    message: "Absence non justifiée — NZINGUEUT Lima David",
    user: "Système",
    time: "Hier, 09h05",
    date: "2026-02-29",
    category: "absence",
  },
  {
    id: 10,
    type: "edit",
    message: "Photo de profil mise à jour — LIMA Mbiatchoua Francis",
    user: "Secrétariat",
    time: "Hier, 08h30",
    date: "2026-02-29",
    category: "modification",
  },
  {
    id: 11,
    type: "grade",
    message: "Notes de Mathématiques saisies pour 3ème A",
    user: "Mme Essono",
    time: "28 fév, 16h00",
    date: "2026-02-28",
    category: "notes",
  },
  {
    id: 12,
    type: "enrollment",
    message: "Transfert entrant — AKOA Jean Paul, Cinquième B",
    user: "Admin",
    time: "28 fév, 11h45",
    date: "2026-02-28",
    category: "inscription",
  },
  {
    id: 13,
    type: "check",
    message: "Présences validées — Première Allemande",
    user: "Prof. Klein",
    time: "28 fév, 08h00",
    date: "2026-02-28",
    category: "validation",
  },
  {
    id: 14,
    type: "alert",
    message: "Retard signalé — MVONDO Claire, Troisième B",
    user: "Système",
    time: "27 fév, 07h55",
    date: "2026-02-27",
    category: "absence",
  },
  {
    id: 15,
    type: "edit",
    message: "Adresse de contact mise à jour — famille Bello",
    user: "Secrétariat",
    time: "27 fév, 14h20",
    date: "2026-02-27",
    category: "modification",
  },
  {
    id: 16,
    type: "grade",
    message: "Notes d'Anglais saisies pour Lower Sixth Arts 3",
    user: "M. Foe",
    time: "26 fév, 17h30",
    date: "2026-02-26",
    category: "notes",
  },
  {
    id: 17,
    type: "enrollment",
    message: "Nouvelle inscription — ETOUNDI Sara, Première D1",
    user: "Admin",
    time: "26 fév, 10h00",
    date: "2026-02-26",
    category: "inscription",
  },
  {
    id: 18,
    type: "check",
    message: "Présences validées — Lower Sixth Arts 5",
    user: "Prof. Abah",
    time: "25 fév, 08h15",
    date: "2026-02-25",
    category: "validation",
  },
];

export const iconMap: Record<
  ActivityType,
  { icon: typeof Activity; bg: string; color: string }
> = {
  enrollment: { icon: UserPlus, bg: "bg-primary/10", color: "text-primary" },
  grade: { icon: BookOpen, bg: "bg-amber-100", color: "text-amber-600" },
  edit: { icon: FileEdit, bg: "bg-sky-100", color: "text-sky-600" },
  alert: { icon: AlertCircle, bg: "bg-red-100", color: "text-red-500" },
  check: { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600" },
};

export const categoryLabels: Record<ActivityItem["category"], string> = {
  inscription: "Inscription",
  notes: "Notes",
  modification: "Modification",
  absence: "Absence",
  validation: "Validation",
};
