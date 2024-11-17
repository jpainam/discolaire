"use client";

import { Pencil, PlusIcon, Trash2 } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { CreateEditGradeAppreciation } from "./CreateEditGradeAppreciation";

export function GradeAppreciationTable({
  classrooms,
}: {
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const { openModal } = useModal();

  const { t } = useLocale();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center border-b bg-muted/50 px-2 pb-1 pt-0">
        <CardTitle>{t("appreciations")}</CardTitle>
        <div className="ml-auto">
          <Button
            onClick={() => {
              openModal({
                className: "w-[500px]",
                title: t("add_appreciation"),
                view: <CreateEditGradeAppreciation classrooms={classrooms} />,
              });
            }}
            size={"sm"}
            variant={"default"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("min_grade")}</TableHead>
              <TableHead>{t("max_grade")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
              <TableHead>{t("classrooms")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-row items-center justify-end gap-2">
                  <Button size={"icon"} variant={"ghost"}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size={"icon"} variant={"ghost"}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
