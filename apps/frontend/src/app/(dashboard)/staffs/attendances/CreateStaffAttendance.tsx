"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { DatePicker } from "~/components/DatePicker";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

export function CreateStaffAttendance() {
  const t = useTranslations();
  const [staffId, setStaffId] = useQueryState("staffId");
  const [today, _] = useState(() => new Date());
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pointage du personnels</CardTitle>
        <CardDescription>Saisir le pointage des enseignants</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-2">
            <Label>{t("staff")}</Label>
            <StaffSelector
              defaultValue={staffId ?? undefined}
              className="w-full"
              onSelect={(val) => {
                void setStaffId(val);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date de présence</Label>
            <DatePicker defaultValue={today} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Statut</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Présent</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Retard</SelectItem>
                <SelectItem value="holiday">Congé</SelectItem>
                <SelectItem value="mission">Mission</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>H. Arrivée</Label>
              <Input type="datetime" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>H. Départ</Label>
              <Input type="datetime" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="col-span-4 flex flex-col gap-2">
            <Label>Observation</Label>
            <Textarea />
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <Button className="w-full">{t("submit")}</Button>
            <Button variant={"secondary"} className="w-full">
              {t("cancel")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
