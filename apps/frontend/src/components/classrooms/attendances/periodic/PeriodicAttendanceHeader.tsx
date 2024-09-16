"use client";

import { Check, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";

export function PeriodicAttendanceHeader() {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    <div className="my-2 flex flex-row items-center justify-center gap-4 px-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          form.reset({
            students: form
              .getValues()
              .students.map(
                (student: {
                  id: string;
                  asbence: string;
                  chatter: string;
                  lateness: string;
                  consigne: string;
                  exclusion: string;
                }) => {
                  return {
                    ...student,
                    absence: "",
                    lateness: "",
                    consigne: "",
                    exclusion: "",
                    chatter: "",
                  };
                },
              ),
          });
        }}
        className="h-8 gap-1 bg-green-50 text-green-700 ring-green-600/20"
        type="button"
      >
        <Check className="h-4 w-4" />
        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
          {t("mark_all_present")}
        </span>
      </Button>
      <Button
        onClick={() => {
          form.reset({
            students: form
              .getValues()
              .students.map(
                (student: {
                  id: string;
                  asbence: number;
                  lateness: number;
                  consigne: number;
                  exclusion: number;
                }) => {
                  return {
                    ...student,
                    absence: "1",
                  };
                },
              ),
          });
        }}
        size="sm"
        type="button"
        variant="destructive"
        className="h-8 gap-1"
      >
        <X className="h-4 w-4" />
        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
          {t("mark_all_absent")}
        </span>
      </Button>
      {/* <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          form.reset({
            students: form
              .getValues()
              .students.map(
                (student: {
                  id: string;
                  asbence: number;
                  late: number;
                  consigned: number;
                  exclusion: number;
                }) => {
                  return {
                    ...student,
                    lateness: "1",
                  };
                },
              ),
          });
        }}
        className="h-8 gap-1 bg-secondary"
      >
        <BookMarked className="h-4 w-4" />
        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
          {t("mark_all_late")}
        </span>
      </Button> */}

      <FlatBadge variant={"blue"}>
        {t("format")}: {t("value")} / {t("justified")}
      </FlatBadge>

      <div className="flex flex-row items-center gap-1">
        <Checkbox defaultChecked id="notifyParents" />{" "}
        <Label htmlFor="notifyParents">{t("notify_parents")}</Label>
        <span className="mr-2" />{" "}
        <Checkbox defaultChecked id="notifyStudents" />
        <Label htmlFor="notifyStudents">{t("notify_students")}</Label>
      </div>
      <div className="ml-auto">
        <Button variant={"default"}>{t("submit")}</Button>
      </div>
    </div>
  );
}
