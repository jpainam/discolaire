import type { LucideIcon } from "lucide-react";
import {
  BaselineIcon,
  Check,
  ClockIcon,
  DiameterIcon,
  FileStack,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { EmptyState } from "@repo/ui/EmptyState";

import { PreventedAttendance } from "~/components/students/attendances/PreventedAttendance";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ termId?: string }>;
}) {
  const { t, i18n } = await getServerTranslations();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const studentId = params.id;
  const termId = searchParams.termId
    ? parseInt(searchParams.termId)
    : undefined;
  const [absences, chatters, consignes, lateness, exclusions] =
    await Promise.all([
      api.absence.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.chatter.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.consigne.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.lateness.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.exclusion.byStudent({
        studentId: studentId,
        termId: termId,
      }),
    ]);
  const TYPE_TO_ICON = {
    absence: BaselineIcon,
    chatter: NewspaperIcon,
    consigne: ShapesIcon,
    exclusion: ShieldAlertIcon,
    lateness: DiameterIcon,
  };
  // merge all absences, chatter etc.. into items array
  // sort by date
  const items: {
    type: "absence" | "chatter" | "consigne" | "lateness" | "exclusion";
    date: Date;
    id: number;
    title: string;
    justificationId?: number;
    endDate?: Date;
  }[] = [
    absences.map((absence) => ({
      type: "absence" as const,
      title: absence.value.toString(),
      date: absence.date,
      id: absence.id,
      justificationId: absence.justification?.id,
    })),
    chatters.map((chatter) => ({
      type: "chatter" as const,
      title: chatter.value.toString(),
      date: chatter.date,
      id: chatter.id,
    })),
    consignes.map((consigne) => ({
      type: "consigne" as const,
      date: consigne.date,
      title: consigne.task,
      id: consigne.id,
    })),
    lateness.map((lateness) => ({
      type: "lateness" as const,
      date: lateness.date,
      title: lateness.duration.toString(),
      id: lateness.id,
      justificationId: lateness.justification?.id,
    })),
    exclusions.map((exclusion) => ({
      type: "exclusion" as const,
      date: exclusion.startDate,
      endDate: exclusion.endDate,
      title: exclusion.reason,
      id: exclusion.id,
    })),
  ]
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!items.length) {
    return <EmptyState className="py-8" title={t("no_attendance_recorded")} />;
  }

  const groups: {
    title: string;
    justified: string;
    total: string;
    icon: LucideIcon;
  }[] = [
    {
      title: t("my_absences"),
      justified: "0",
      total: "20",
      icon: BaselineIcon,
    },
    { title: t("my_lates"), justified: "25h00", total: "26h", icon: ClockIcon },
    {
      title: t("my_exclusions"),
      justified: "0",
      total: "2",
      icon: ShieldAlertIcon,
    },
    {
      title: t("my_chatters"),
      justified: "0",
      total: "2",
      icon: NewspaperIcon,
    },
    { title: t("my_consignes"), justified: "0", total: "2", icon: ShapesIcon },
  ];

  console.log(items);
  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr_200px]">
      <div className="h-screen divide-x border-r">
        <div className="flex cursor-pointer items-center gap-2 border-b px-2 py-2 hover:bg-muted hover:text-muted-foreground">
          <FileStack className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {" "}
              {t("all_my_attendances")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("justified")}
            </span>
          </div>
          <span className="ml-auto text-xs font-bold">20</span>
        </div>

        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              className="flex cursor-pointer items-center gap-2 border-b px-2 py-2 hover:bg-muted hover:text-muted-foreground"
              key={group.title}
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{group.title}</span>
                <span className="text-xs text-muted-foreground">
                  {t("justified")}
                </span>
              </div>
              <span className="ml-auto text-xs font-bold">20</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="actions"
            //checked={showActionRequired}
            //onCheckedChange={setShowActionRequired}
          />
          <label htmlFor="actions" className="text-sm">
            Uniquement les évènements qui nécessitent une action
          </label>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = TYPE_TO_ICON[item.type];
            return (
              <div
                key={`${item.type}-${index}`}
                className="flex items-center gap-2 rounded-md border p-2"
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    !item.justificationId ? "text-destructive" : "",
                  )}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-md font-semibold">
                      {Intl.DateTimeFormat(i18n.language, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "numeric",
                      }).format(item.date)}
                    </div>
                    <Button variant="default">Justifier</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-sm text-red-500">Retard à justifier</p>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Check className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <h3 className="font-semibold">Jeu. 24 oct. à 8h00</h3>
              <p className="text-sm text-muted-foreground">5 min.</p>
              <p className="text-sm text-muted-foreground">
                Motif : SANS EXCUSES
              </p>
              <p className="text-sm">Retard justifié</p>
            </div>
          </div>
        </div>
      </div>
      <PreventedAttendance />
    </div>
  );
}
