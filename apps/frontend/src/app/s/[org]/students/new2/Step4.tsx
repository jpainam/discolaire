"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import countryNames from "react-phone-number-input/locale/en.json";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

import { useTRPC } from "~/trpc/react";
import { useStudentStore } from "./store";

export function Step4() {
  const form = useFormContext();
  const t = useTranslations();
  const { studentData } = useStudentStore();
  const locale = useLocale();
  const trpc = useTRPC();
  const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
  const classrooms = classroomsQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
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
                <strong>{t("nationality")}</strong>{" "}
                {studentData.countryId && (
                  <NationalityLine nationalityId={studentData.countryId} />
                )}
              </div>
              <div>
                <strong>{t("classroom")}</strong>{" "}
                {classrooms.find((c) => c.id === studentData.classroomId)
                  ?.name ?? "N/A"}
              </div>

              <div>
                <strong>{t("status")}</strong> {t(studentData.status)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Phone:</strong> {"+1234567890"}
              </p>
              <p>
                <strong>Email:</strong> {"email"}
              </p>
              <p>
                <strong>Address:</strong> {"residence"}
              </p>
              <p>
                <strong>City:</strong> {"Ville"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parents/Guardians (3)</h3>
          {[1, 2, 3].length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2, 3].map((parent) => (
                <div key={parent} className="bg-muted/50 rounded-lg border p-2">
                  <div className="flex flex-row items-center gap-4">
                    <p className="font-medium">Mr Dupont Pierre</p>
                    <Badge variant="default" className="mt-1 text-xs">
                      Emergency Contact
                    </Badge>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                      Pere adoptif
                    </p>{" "}
                    /<p className="text-muted-foreground text-sm">Phone 1</p>
                  </div>
                  {/* {parent.emergencyContact && ( */}

                  {/* )} */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No parents/guardians added yet.</p>
          )}
        </div>

        {/* {studentData.observation && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <p className="text-sm">{studentData.observation}</p>
            </div>
          </>
        )} */}
      </CardContent>
    </Card>
  );
}

function NationalityLine({ nationalityId }: { nationalityId: string }) {
  const trpc = useTRPC();
  const country = countryNames[nationalityId];

  return <div>{country}</div>;
}
