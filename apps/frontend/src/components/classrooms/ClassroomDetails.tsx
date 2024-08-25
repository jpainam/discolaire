import { getServerTranslations } from "@/app/i18n/server";
import { CURRENCY } from "@/lib/constants";
import { api } from "@/trpc/server";
import { sumBy } from "lodash";
import {
  BookUser,
  CircleDollarSign,
  CircleGauge,
  CircleUser,
  File,
  Hash,
  Newspaper,
  Recycle,
  SquareLibrary,
  SquareUser,
  TableProperties,
} from "lucide-react";

export async function ClassroomDetails({
  classroomId,
}: {
  classroomId: string;
}) {
  const { t, i18n } = await getServerTranslations();
  const fees = await api.classroom.fees(classroomId);
  const classroom = await api.classroom.get(classroomId);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 divide-x w-full">
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <TableProperties className="w-4 h-4" />
            {t("name")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <File className="w-4 h-4" />
            {t("shortName")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.shortName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <SquareLibrary className="w-4 h-4" />
            {t("section")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.section?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <CircleDollarSign className="w-4 h-4" />
            {t("fees")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {sumBy(fees, "amount").toLocaleString(i18n.language)} {CURRENCY}
          </span>
        </li>
      </ul>
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <Newspaper className="w-4 h-4" />
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("reportName")}
            </span>
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.reportName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <CircleGauge className="w-4 h-4" />
            {t("level")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.level?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <Recycle className="w-4 h-4" />
            {t("cycle")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.cycle?.name}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground"></span>
          <span className="opacity-0">.</span>
        </li>
      </ul>
      <ul className="grid gap-3 p-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <SquareUser className="w-4 h-4" />
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("senior_advisor")}
            </span>
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.seniorAdvisor?.lastName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <BookUser className="w-4 h-4" />
            {t("classroom_leader")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.classroomLeader?.lastName}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <Hash className="w-4 h-4" />
            {t("max_size")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom?.maxSize}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-row gap-1 items-center">
            <CircleUser className="w-4 h-4" />
            {t("head_teacher")}
          </div>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {classroom.headTeacher?.lastName}
          </span>
        </li>
      </ul>
    </div>
  );
}
