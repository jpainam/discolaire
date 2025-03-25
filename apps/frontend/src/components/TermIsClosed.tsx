"use client";
import { cn } from "@repo/ui/lib/utils";
import { TriangleAlert } from "lucide-react";
import { useLocale } from "~/i18n";

export function TermIsClosed({
  isClosed,
  className,
}: {
  isClosed: boolean;
  className?: string;
}) {
  const { t } = useLocale();
  if (isClosed) {
    return (
      <div
        className={cn(
          "rounded-md border border-amber-500/50 px-4 py-3 text-amber-600",
          className
        )}
      >
        <p className="text-sm">
          <TriangleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("this_term_is_closed")}
        </p>
      </div>
    );
  }
  return null;
}
