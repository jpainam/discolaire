"use client";

import { format } from "date-fns";
import { Calendar, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { cn } from "~/lib/utils";
import { CreateEditTerm } from "./CreateEditTerm";

export function TermDetails({
  term,
}: {
  term: RouterOutputs["term"]["all"][number];
}) {
  const t = useTranslations();
  const { closeModal, openModal } = useModal();
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("Start date")}</span>
            <span>{format(term.startDate, "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("End date")}</span>
            <span>{format(term.endDate, "MMM d, yyyy")}</span>
          </div>
          <Separator />

          <div className="text-muted-foreground flex justify-end">
            Duration:{" "}
            {Math.ceil(
              (term.endDate.getTime() - term.startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            )}{" "}
            {t("days")}
          </div>
        </CardContent>
      </Card>

      {term.parts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="text-primary h-4 w-4" />
              Composition ({term.parts.length} sub-periods)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {term.parts.map((subPeriod, index) => (
              <div
                className={cn(
                  "flex items-center justify-between gap-2 pb-2",
                  index < term.parts.length - 1 && "border-b",
                )}
                key={`${subPeriod.childId}-${index}`}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={"secondary"}
                    className="h-5 min-w-5 rounded-full px-1"
                  >
                    {subPeriod.child.order}
                  </Badge>
                  <span>{subPeriod.child.name}</span>
                </div>

                <span className="text-muted-foreground text-xs">
                  {format(subPeriod.child.startDate, "MMM d")} -{" "}
                  {format(subPeriod.child.endDate, "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-2">
        <span className="text-muted-foreground text-sm">{t("schoolYear")}</span>
        <span className="text-foreground font-mono font-medium">
          {term.schoolYear.name}
        </span>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("close")}
        </Button>
        <Button
          onClick={() => {
            openModal({
              description: "Update the period details below.",
              className: "sm:max-w-xl",
              title: "Edit Period",
              view: <CreateEditTerm term={term} />,
            });
          }}
        >
          {t("edit")}
        </Button>
      </div>
    </div>
  );
}
