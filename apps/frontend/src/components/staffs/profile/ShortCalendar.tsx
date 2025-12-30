"use client";

import * as React from "react";
import { formatDateRange } from "little-date";
import { PlusIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { enUS, es, fr } from "react-day-picker/locale";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Design Review",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
];

export function ShortCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12),
  );

  const locale = useLocale();

  return (
    <Card>
      <CardContent className="">
        <Calendar
          mode="single"
          locale={
            locale.includes("fr") ? fr : locale.includes("es") ? es : enUS
          }
          selected={date}
          onSelect={setDate}
          className="w-full p-0"
          required
        />
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 border-t">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <Button variant="ghost" size="icon">
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(new Date(event.from), new Date(event.to))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
