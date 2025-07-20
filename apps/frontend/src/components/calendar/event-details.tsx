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
          <User className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Responsible</p>
            <p className="text-t-secondary text-sm">{event.user.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Start Date</p>
            <p className="text-t-secondary text-sm">
              {format(startDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">End Date</p>
            <p className="text-t-secondary text-sm">
              {format(endDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Text className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-t-secondary text-sm">{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
