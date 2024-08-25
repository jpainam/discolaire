"use client";

import { useEffect, useRef } from "react";

import { useLocale } from "@repo/i18n";

import type { ConfettiRef } from "~/components/magicui/Confetti";
import Confetti from "~/components/magicui/Confetti";
import { cn } from "~/lib/utils";

export function DateOfBirthWidget({
  date,
  className,
}: {
  date?: Date | null;
  className?: string;
}) {
  const { t, i18n } = useLocale();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const confettiRef = useRef<ConfettiRef>(null);
  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);
  if (!date) return null;
  return (
    <div className={cn(className)}>
      {date && dateFormatter.format(new Date(date))}
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 h-full w-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
    </div>
  );
}
