"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useTRPC } from "~/trpc/react";
import { useStudentFormContext } from "./StudentFormContext";

export function ReviewSubmitStep() {
  const t = useTranslations();
  const trpc = useTRPC();
  const locale = useLocale();
  const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
  const classrooms = classroomsQuery.data ?? [];
  const { basicInfo, academicInfo, selectedParents } = useStudentFormContext();
  const { data: relationships } = useQuery(
    trpc.contactRelationship.all.queryOptions(),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Item label={t("lastName")} value={basicInfo.lastName} />
          <Item label={t("firstName")} value={basicInfo.firstName} />
          <Item
            label={t("dateOfBirth")}
            value={basicInfo.dateOfBirth.toLocaleDateString(locale, {
              timeZone: "UTC",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
          <Item label={t("gender")} value={t(basicInfo.gender)} />
          <Item label={t("country")} value={basicInfo.countryId} />
          <Item
            label={t("classroom")}
            value={
              classrooms.find((c) => c.id === academicInfo.classroomId)?.name ??
              "N/A"
            }
          />
          <Item label={t("status")} value={t(academicInfo.status)} />
          <Item label={t("phoneNumber")} value={basicInfo.phoneNumber} />
          <Item label={t("address")} value={basicInfo.residence} />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-semibold">
            Parents/Guardians ({selectedParents.length})
          </div>
          {selectedParents.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              Aucun parents/contact sélectionnés
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedParents.map((parent) => (
                <div
                  key={parent.id}
                  className="bg-muted/50 rounded-lg border p-2"
                >
                  <div className="flex flex-row items-center gap-4">
                    <Label>{parent.name}</Label>
                    <Badge className="text-xs">
                      {
                        relationships?.find(
                          (r) => r.id.toString() == parent.relationshipId,
                        )?.name
                      }
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

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label>{label}</Label>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}
