"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";

import type { IEvent } from "./interfaces";

interface IProps {
  event: IEvent;
}

export function EventDetails({ event }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <User className="mt-1 size-4 shrink-0 text-t-secondary" />
          <div>
            <p className="text-sm font-medium">Responsible</p>
            <p className="text-sm text-t-secondary">{event.user.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="mt-1 size-4 shrink-0 text-t-secondary" />
          <div>
            <p className="text-sm font-medium">Start Date</p>
            <p className="text-sm text-t-secondary">
              {format(startDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="mt-1 size-4 shrink-0 text-t-secondary" />
          <div>
            <p className="text-sm font-medium">End Date</p>
            <p className="text-sm text-t-secondary">
              {format(endDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Text className="mt-1 size-4 shrink-0 text-t-secondary" />
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-t-secondary">{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
