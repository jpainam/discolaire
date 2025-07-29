import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  BookText,
  CalendarDays,
  Captions,
  Contact,
  FolderOpen,
  HandCoins,
  NotebookPen,
  NotepadTextDashed,
  Printer,
  Proportions,
  Receipt,
  TableProperties,
  Users,
} from "lucide-react";

export const sidebarIcons: Record<string, LucideIcon> = {
  documents: FolderOpen,
  assignments: NotebookPen,
  gradesheets: BookOpenText,
  fees: Receipt,
  print: Printer,
  enrollments: Users,
  details: TableProperties,
  financial_situation: HandCoins,
  subjects: Captions,
  programs: BookText,
  attendances: Contact,
  reportcards: Proportions,
  timetables: CalendarDays,
  teaching_session: NotepadTextDashed,
};
