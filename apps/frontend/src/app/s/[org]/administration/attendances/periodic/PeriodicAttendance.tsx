"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Label } from "@repo/ui/components/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { AttendanceClassroomStudentList } from "./AttendanceClassroomStudentList";

export function PeriodicAttendance() {
  const [classroomId, setClassroomId] = useQueryState("classroomId");
  const [termId, setTermId] = useQueryState("termId");
  const t = useTranslations();
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-4 px-4">
        <div className="flex flex-row items-center gap-2">
          <Label>{t("classrooms")}</Label>
          <ClassroomSelector
            className="w-96"
            defaultValue={classroomId ?? ""}
            onSelect={(val) => {
              setClassroomId(val);
            }}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Label>{t("terms")}</Label>
          <TermSelector
            className="w-96"
            defaultValue={termId}
            onChange={(val) => {
              setTermId(val);
            }}
          />
        </div>
        <InputGroup className="w-56">
          <InputGroupInput
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        {classroomId && termId && (
          <AttendanceClassroomStudentList
            classroomId={classroomId}
            termId={termId}
          />
        )}
      </div>
    </div>
  );
}
