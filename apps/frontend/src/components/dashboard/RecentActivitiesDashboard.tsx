"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock } from "lucide-react";
import { useLocale } from "next-intl";

import {
  DeleteIcon,
  EditIcon,
  EnrollmentIcon,
  FileIcon,
  FilesIcon,
  LogoutIcon,
  PlusIcon,
} from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

type AppIcon = React.ComponentType<{ className?: string }>;

const actionIconMap: Record<
  string,
  { icon: AppIcon; iconBg: string; iconColor: string }
> = {
  create: {
    icon: PlusIcon,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  update: {
    icon: EditIcon,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  delete: {
    icon: DeleteIcon,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  deleted: {
    icon: DeleteIcon,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  enrolled: {
    icon: EnrollmentIcon,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
  unenrolled: {
    icon: LogoutIcon,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  uploaded: {
    icon: FileIcon,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  downloaded: {
    icon: FilesIcon,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
};

const fallbackStyle = {
  icon: EditIcon,
  iconBg: "bg-muted/10",
  iconColor: "text-muted-foreground",
};

function getStyle(action: string) {
  return actionIconMap[action] ?? fallbackStyle;
}

function relativeTime(date: Date, locale: string): string {
  const diffSec = (date.getTime() - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
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
      return formatter.format(Math.round(diffSec / seconds), unit);
    }
  }
  return "";
}

export function RecentActivitiesDashboard() {
  const trpc = useTRPC();
  const locale = useLocale();

  const { data: activities, isPending } = useQuery(
    trpc.logActivity.all.queryOptions({ limit: 15 }),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle> Activités récentes</CardTitle>
      </CardHeader>

      <CardContent className="px-2 py-0">
        {isPending ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2.5 rounded-lg px-2 py-2">
              <div className="bg-muted h-7 w-7 shrink-0 animate-pulse rounded-full" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-2.5 w-1/3 animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : !activities?.length ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-xs">
            Aucune activité récente
          </p>
        ) : (
          activities.map((item, idx) => {
            const { icon: Icon, iconBg, iconColor } = getStyle(item.action);
            return (
              <div
                key={item.id}
                className="hover:bg-muted/60 relative flex cursor-pointer gap-2.5 rounded-lg px-2 py-2 transition-colors"
              >
                {idx < activities.length - 1 && (
                  <div className="bg-border absolute top-9 bottom-0 left-[22px] z-0 w-px" />
                )}
                <div
                  className={cn(
                    "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    iconBg,
                  )}
                >
                  <Icon className={cn("size-3.5", iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-foreground [&_a]:text-primary text-xs leading-relaxed [&_a]:underline [&_a]:underline-offset-2"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                  <div className="mt-0.5 flex items-center gap-1">
                    <Clock className="text-muted-foreground/60 h-2.5 w-2.5" />
                    <span className="text-muted-foreground/60 text-[10px]">
                      {relativeTime(item.createdAt, locale)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="mt-auto justify-center">
        <Button variant={"link"} className="w-ful">
          Voir toutes les activités <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
