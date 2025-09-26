"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";

export function AttendanceClassroom() {
  const t = useTranslations();
  const [classroomId, setClassroomId] = useQueryState("classroomId");
  const [termId, setTermId] = useQueryState("termId");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-row items-center gap-8 px-4">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          className="w-56"
          defaultValue={classroomId ?? ""}
          onSelect={(val) => {
            void setClassroomId(val);
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          className="w-56"
          defaultValue={termId}
          onChange={(val) => {
            void setTermId(val);
          }}
        />
      </div>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder={"Rechercher un.e élève..."}
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div className="ml-auto">
        <Button type="submit" size={"sm"}>
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
