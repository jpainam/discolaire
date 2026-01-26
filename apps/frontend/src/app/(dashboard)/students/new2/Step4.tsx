"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useTRPC } from "~/trpc/react";
import { useStudentStore } from "./store";

export function Step4() {
  const t = useTranslations();
  const { studentData } = useStudentStore();
  const trpc = useTRPC();
  const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
  const classrooms = classroomsQuery.data ?? [];

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
              <strong>{t("lastName")}</strong> {studentData.lastName}
            </div>
            <div>
              <strong>{t("firstName")}</strong> {studentData.firstName}
            </div>
            <p>
              <strong>{t("dateOfBirth")}</strong>{" "}
              {studentData.dateOfBirth?.toString()}
            </p>
            <div>
              <strong>{t("gender")}</strong> {studentData.gender}
            </div>
            <div>
              <strong>{t("country")}</strong> {studentData.countryId}
            </div>
            <div>
              <strong>{t("classroom")}</strong>{" "}
              {classrooms.find((c) => c.id === studentData.classroomId)?.name ??
                "N/A"}
            </div>

            <div>
              <strong>{t("status")}</strong> {t(studentData.status ?? "")}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>{t("phoneNumber")}</strong> {studentData.phoneNumber}
            </div>

            <div>
              <strong>{t("address")}</strong> {"residence"}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parents/Guardians (3)</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3].map((parent) => (
              <div key={parent} className="bg-muted/50 rounded-lg border p-2">
                <div className="flex flex-row items-center gap-4">
                  <p className="font-medium">Mr Dupont Pierre</p>
                  <Badge variant="default" className="text-xs">
                    Emergency Contact
                  </Badge>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <p className="text-muted-foreground text-sm">Pere adoptif</p>{" "}
                  /<p className="text-muted-foreground text-sm">Phone 1</p>
                </div>
                {/* {parent.emergencyContact && ( */}

                {/* )} */}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
