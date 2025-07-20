"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sumBy } from "lodash";
import {
  BookUser,
  CircleDollarSign,
  CircleGauge,
  CircleUser,
  Hash,
  Newspaper,
  Recycle,
  SquareLibrary,
  SquareUser,
  TableProperties,
} from "lucide-react";

import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

export function ClassroomDetails() {
  const { t, i18n } = useLocale();
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: fees } = useSuspenseQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  return (
    <div className="grid w-full gap-4 divide-x px-4 md:grid-cols-2 lg:grid-cols-3">
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <TableProperties className="h-4 w-4" />
            {t("name")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <Newspaper className="h-4 w-4" />
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("reportName")}
            </span>
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.reportName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <SquareLibrary className="h-4 w-4" />
            {t("section")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.section?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <CircleDollarSign className="h-4 w-4" />
            {t("fees")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {sumBy(fees, "amount").toLocaleString(i18n.language)} {CURRENCY}
          </span>
        </li>
      </ul>
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <CircleGauge className="h-4 w-4" />
            {t("level")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.level.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <Recycle className="h-4 w-4" />
            {t("cycle")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.cycle?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <SquareUser className="h-4 w-4" />
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("senior_advisor")}
            </span>
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.seniorAdvisor?.lastName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <BookUser className="h-4 w-4" />
            {t("classroom_leader")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.classroomLeader?.lastName}
          </span>
        </li>
      </ul>
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <Hash className="h-4 w-4" />
            {t("max_size")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.maxSize}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row items-center gap-1">
            <CircleUser className="h-4 w-4" />
            {t("head_teacher")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.headTeacher?.lastName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground"></span>
          <span className="opacity-0">.</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground"></span>
          <span className="opacity-0">.</span>
        </li>
      </ul>
    </div>
  );
}
