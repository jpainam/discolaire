/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTranslations } from "next-intl";

import type {
  ClassroomPrintFormat,
  ClassroomPrintParamKey,
} from "./classroom-print-registry";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { AccountingJournalSelector } from "~/components/shared/selects/AccountingJournalSelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface ClassroomPrintHeaderProps {
  classroomId: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  requiredParams: ClassroomPrintParamKey[];
  format: ClassroomPrintFormat;
  onFormatChange: (value: ClassroomPrintFormat) => void;
  termId: string | null;
  onTermIdChange: (value: string | null) => void;
  subjectId: string | null;
  onSubjectIdChange: (value: string | null) => void;
  journalId: string | null;
  onJournalIdChange: (value: string | null) => void;
  status: string | null;
  onStatusChange: (value: string | null) => void;
  dueDate: string | null;
  onDueDateChange: (value: string | null) => void;
  gradesheetId: string | null;
  onGradesheetIdChange: (value: string | null) => void;
}

export function ClassroomPrintHeader({
  classroomId,
  searchQuery,
  onSearchQueryChange,
  requiredParams,
  format,
  onFormatChange,
  termId,
  onTermIdChange,
  subjectId,
  onSubjectIdChange,
  journalId,
  onJournalIdChange,
  status,
  onStatusChange,
  dueDate,
  onDueDateChange,
  gradesheetId,
  onGradesheetIdChange,
}: ClassroomPrintHeaderProps) {
  const t = useTranslations();
  const required = new Set(requiredParams);

  return (
    <div className="bg-muted/50 flex flex-col gap-4 border-y px-4 py-1 md:flex-row md:flex-wrap">
      {/* <InputGroup className="md:min-w-[300px] md:flex-1">
        <InputGroupInput
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("search")}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup> */}

      {required.has("termId") ? (
        <TermSelector
          defaultValue={termId}
          onChange={onTermIdChange}
          className="w-full md:w-[300px]"
        />
      ) : null}

      {required.has("subjectId") ? (
        <SubjectSelector
          classroomId={classroomId}
          defaultValue={subjectId ?? undefined}
          onChange={onSubjectIdChange}
          className="w-full md:w-[300px]"
        />
      ) : null}

      {required.has("journalId") ? (
        <AccountingJournalSelector
          defaultValue={journalId ?? undefined}
          onChange={onJournalIdChange}
          className="w-full md:w-[260px]"
        />
      ) : null}

      {required.has("status") ? (
        <Select
          value={status ?? undefined}
          onValueChange={(value) => {
            onStatusChange(value == "all" ? null : value);
          }}
        >
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder={t("situation")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="debit">{t("debit")}</SelectItem>
            <SelectItem value="credit">{t("credit")}</SelectItem>
          </SelectContent>
        </Select>
      ) : null}

      {required.has("dueDate") ? (
        <Input
          type="date"
          value={dueDate ?? ""}
          onChange={(event) => {
            const value = event.target.value.trim();
            onDueDateChange(value.length > 0 ? value : null);
          }}
          className="w-full md:w-[170px]"
        />
      ) : null}

      {required.has("gradesheetId") ? (
        <Input
          placeholder="Grade sheet ID"
          value={gradesheetId ?? ""}
          onChange={(event) => {
            const value = event.target.value.trim();
            onGradesheetIdChange(value.length > 0 ? value : null);
          }}
          className="w-full md:w-[190px]"
        />
      ) : null}

      {required.has("format") ? (
        <Select
          value={format}
          onValueChange={(value) =>
            onFormatChange(value as ClassroomPrintFormat)
          }
        >
          <SelectTrigger className="w-full md:w-[130px]">
            <SelectValue placeholder="Export format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">
              <PDFIcon />
              PDF
            </SelectItem>
            <SelectItem value="csv">
              <XMLIcon />
              Excel
            </SelectItem>
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
