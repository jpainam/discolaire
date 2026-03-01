"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsIsoDate, useQueryStates } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { DateRangePicker } from "../DateRangePicker";
import { TableSkeleton } from "../skeletons/table-skeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "../ui/timeline";
import { getActionStyle } from "./action-styles";

const ACTIONS = [
  "create",
  "update",
  "delete",
  "enrolled",
  "unenrolled",
  "uploaded",
  "downloaded",
  "deleted",
];

export function LogActivityList({
  entityId,
  entityType,
  className,
}: {
  entityId: string;
  entityType: "staff" | "student" | "contact"; // app's "entity" concept — person record
  className?: string;
}) {
  const trpc = useTRPC();
  const [queryText, setQueryText] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | undefined>(
    undefined,
  );
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 300);

  const locale = useLocale();

  const [range, setRange] = useQueryStates({
    from: parseAsIsoDate,
    to: parseAsIsoDate,
  });

  const { data: activities, isPending } = useQuery(
    trpc.logActivity.all.queryOptions({
      limit: 100,
      targetId: entityId,
      targetType: entityType,
      query: queryText || undefined,
      action: selectedAction,
      from: range.from ?? undefined,
      to: range.to ?? undefined,
    }),
  );
  const t = useTranslations();

  if (isPending) {
    return <TableSkeleton rows={8} cols={5} />;
  }

  return (
    <div className={cn("flex flex-col gap-2 px-4", className)}>
      <div className="grid grid-cols-3 gap-4">
        <InputGroup>
          <InputGroupInput
            onChange={(e) => debounce(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <DateRangePicker
          className="w-full"
          onSelectAction={(value) => {
            void setRange(value ? (value as { from: Date; to: Date }) : null);
          }}
        />
        <Select
          value={selectedAction ?? ""}
          onValueChange={(v) =>
            setSelectedAction(v === "all" ? undefined : v || undefined)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("Action")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All")}</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {t(a)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Timeline defaultValue={3}>
        {activities?.map((item) => {
          const { icon: Icon, iconColor, iconBg } = getActionStyle(item.action);
          return (
            <TimelineItem
              className="group-data-[orientation=vertical]/timeline:ms-10"
              key={item.id}
              step={item.id}
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineIndicator
                  className={cn(
                    "flex size-6 items-center justify-center border-none",
                    "group-data-[orientation=vertical]/timeline:-left-7",
                    iconBg ?? "bg-primary/10",
                    iconColor,
                  )}
                >
                  <Icon size={14} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent>
                {/* Description is server-generated HTML with entity links */}
                <TimelineTitle
                  className="mt-0.5 text-sm font-normal [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                <TimelineDate className="mt-1 mb-0">
                  {item.createdAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TimelineDate>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}
