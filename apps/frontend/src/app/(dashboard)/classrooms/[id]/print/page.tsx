"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";

import type { ClassroomPrintParamKey } from "~/components/classrooms/print/classroom-print-registry";
import {
  CLASSROOM_PRINT_ACTIONS,
  CLASSROOM_PRINT_CATEGORIES,
  CLASSROOM_PRINT_PARAM_LABELS,
} from "~/components/classrooms/print/classroom-print-registry";
import { ClassroomPrintActionCard } from "~/components/classrooms/print/ClassroomPrintActionCard";
import { ClassroomPrintHeader } from "~/components/classrooms/print/ClassroomPrintHeader";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DataExportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [format, setFormat] = useQueryState(
    "format",
    parseAsStringLiteral(["pdf", "csv"]).withDefault("pdf"),
  );
  const [termId, setTermId] = useQueryState("termId", parseAsString);
  const [subjectId, setSubjectId] = useQueryState("subjectId", parseAsString);
  const [journalId, setJournalId] = useQueryState("journalId", parseAsString);
  const [status, setStatus] = useQueryState("status", parseAsString);
  const [dueDate, setDueDate] = useQueryState("dueDate", parseAsString);
  const [gradesheetId, setGradesheetId] = useQueryState(
    "gradesheetId",
    parseAsString,
  );

  const params = useParams<{ id: string }>();

  const filteredActions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return CLASSROOM_PRINT_ACTIONS.filter((action) => {
      if (!normalizedQuery) {
        return true;
      }
      const haystack =
        `${action.label} ${action.description ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    }).sort((a, b) => a.order - b.order);
  }, [searchQuery]);

  const categories = useMemo(
    () =>
      CLASSROOM_PRINT_CATEGORIES.map((category) => ({
        ...category,
        actions: filteredActions.filter(
          (action) => action.category == category.id,
        ),
      })).filter((category) => category.actions.length > 0),
    [filteredActions],
  );

  const visibleActions = useMemo(() => {
    if (activeTab == "all") {
      return filteredActions;
    }
    return filteredActions.filter((action) => action.category == activeTab);
  }, [activeTab, filteredActions]);

  const requiredParams = useMemo(
    () =>
      Array.from(
        new Set(
          visibleActions.flatMap((action) => action.requiredParams ?? []),
        ),
      ),
    [visibleActions],
  );

  const printParams = {
    format,
    termId,
    subjectId,
    journalId,
    status,
    dueDate,
    gradesheetId,
  };

  const getMissingParams = (required: ClassroomPrintParamKey[]) => {
    return required.filter((param) => {
      const value = printParams[param];
      return value == null || value === "";
    });
  };

  const handlePrint = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2">
      <ClassroomPrintHeader
        classroomId={params.id}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        requiredParams={requiredParams}
        format={format}
        onFormatChange={(value) => {
          void setFormat(value);
        }}
        termId={termId}
        onTermIdChange={(value) => {
          void setTermId(value);
        }}
        subjectId={subjectId}
        onSubjectIdChange={(value) => {
          void setSubjectId(value);
        }}
        journalId={journalId}
        onJournalIdChange={(value) => {
          void setJournalId(value);
        }}
        status={status}
        onStatusChange={(value) => {
          void setStatus(value);
        }}
        dueDate={dueDate}
        onDueDateChange={(value) => {
          void setDueDate(value);
        }}
        gradesheetId={gradesheetId}
        onGradesheetIdChange={(value) => {
          void setGradesheetId(value);
        }}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full px-4"
      >
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">
            {t("all")}
            <Badge variant="secondary">{filteredActions.length}</Badge>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
              <Badge variant="secondary">{category.actions.length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActions.map((action) => {
              const missingParams = getMissingParams(
                action.requiredParams ?? [],
              );
              const disabled = missingParams.length > 0;

              return (
                <ClassroomPrintActionCard
                  key={action.id}
                  id={action.id}
                  label={action.label}
                  description={action.description}
                  disabled={disabled}
                  missingParams={missingParams}
                  missingParamLabels={CLASSROOM_PRINT_PARAM_LABELS}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    handlePrint(
                      action.buildUrl({
                        classroomId: params.id,
                        params: {
                          format,
                          termId,
                          subjectId,
                          journalId,
                          status,
                          dueDate,
                          gradesheetId,
                        },
                      }),
                    );
                  }}
                />
              );
            })}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.actions.map((action) => {
                const missingParams = getMissingParams(
                  action.requiredParams ?? [],
                );
                const disabled = missingParams.length > 0;

                return (
                  <ClassroomPrintActionCard
                    key={action.id}
                    id={action.id}
                    label={action.label}
                    description={action.description}
                    disabled={disabled}
                    missingParams={missingParams}
                    missingParamLabels={CLASSROOM_PRINT_PARAM_LABELS}
                    onClick={() => {
                      if (disabled) {
                        return;
                      }
                      handlePrint(
                        action.buildUrl({
                          classroomId: params.id,
                          params: {
                            format,
                            termId,
                            subjectId,
                            journalId,
                            status,
                            dueDate,
                            gradesheetId,
                          },
                        }),
                      );
                    }}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
