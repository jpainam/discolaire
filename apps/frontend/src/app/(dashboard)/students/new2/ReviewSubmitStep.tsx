"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useTRPC } from "~/trpc/react";
import { useStudentFormContext } from "./StudentFormContext";

export function ReviewSubmitStep() {
  const t = useTranslations();
  const trpc = useTRPC();
  const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
  const classrooms = classroomsQuery.data ?? [];
  const { basicInfo, academicInfo, selectedParents } = useStudentFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <Check className="h-4 w-4" />
          Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 text-sm">
            <div>
              <strong>{t("lastName")}</strong> {basicInfo.lastName}
            </div>
            <div>
              <strong>{t("firstName")}</strong> {basicInfo.firstName}
            </div>
            <p>
              <strong>{t("dateOfBirth")}</strong>{" "}
              {basicInfo.dateOfBirth?.toString()}
            </p>
            <div>
              <strong>{t("gender")}</strong> {basicInfo.gender}
            </div>
            <div>
              <strong>{t("nationality")}</strong> {basicInfo.countryId}
            </div>
            <div>
              <strong>{t("classroom")}</strong>{" "}
              {classrooms.find((c) => c.id === academicInfo.classroomId)?.name ??
                "N/A"}
            </div>
            <div>
              <strong>{t("status")}</strong> {t(academicInfo.status ?? "")}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>{t("phoneNumber")}</strong> {basicInfo.phoneNumber}
            </div>
            <div>
              <strong>{t("address")}</strong> {basicInfo.residence}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Parents/Guardians ({selectedParents.length})
          </h3>
          {selectedParents.length === 0 ? (
            <div className="text-muted-foreground text-sm">{t("no_data")}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedParents.map((parent) => (
                <div
                  key={parent.id}
                  className="bg-muted/50 rounded-lg border p-2"
                >
                  <div className="flex flex-row items-center gap-4">
                    <p className="font-medium">{parent.name}</p>
                    <Badge variant="default" className="text-xs">
                      {parent.relationshipId}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
