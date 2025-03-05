"use client";

import { Input } from "@repo/ui/components/input";
import { useEffect, useState } from "react";

export function DatePicker({
  onChange,
  defaultValue,
  className,
}: {
  onChange?: (date: Date | null) => void;
  className?: string;
  defaultValue?: Date;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ?? null,
  );

  useEffect(() => {
    setSelectedDate(defaultValue ?? null);
  }, [defaultValue]);

  const formatDate = (date: Date | null) =>
    date instanceof Date && !isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : "";

  return (
    <Input
      className={className}
      type="date"
      value={formatDate(selectedDate)}
      onChange={(e) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        setSelectedDate(newDate);
        onChange?.(newDate);
      }}
    />
  );
}
