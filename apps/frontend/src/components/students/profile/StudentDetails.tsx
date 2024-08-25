import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerTranslations } from "@/app/i18n/server";
import House from "@/components/lucide/House";
import { routes } from "@/configs/routes";
import { api } from "@/trpc/server";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";
import {
  AtSign,
  BookHeart,
  Cake,
  CakeSlice,
  CalendarMinus,
  CalendarPlus,
  Church,
  CircleUser,
  ExternalLink,
  Phone,
  School,
  ShieldCheck,
  SquareUserRound,
} from "lucide-react";

import { StudentContactTable } from "../contacts/StudentContactTable";

export async function StudentDetails({ id }: { id: string }) {
  const { t, i18n } = await getServerTranslations();

  // TODO: Refactor this to use Promise.allSettled
  const siblings = await api.student.siblings(id);
  const studentContacts = await api.student.contacts(id);
  const student = await api.student.get(id);

  if (!student) {
    notFound();
  }
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="grid text-sm">
      <div className="grid grid-cols-2 gap-y-3 xl:grid-cols-4">
        <span className="flex flex-row items-center gap-1 text-xs text-muted-foreground 2xl:text-sm">
          <SquareUserRound className="h-4 w-4 stroke-1" /> {t("lastName")}
        </span>
        <span>{student?.lastName || "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground md:text-xs 2xl:text-sm">
          <SquareUserRound className="h-4 w-4 stroke-1" />
          {t("firstName")}
        </span>
        <span>{student?.firstName || "N/A"} </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <Church className="h-4 w-4 stroke-1" />
          {t("religion")}
        </span>
        <span>{student.religion ? t(student.religion) : "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground md:text-xs 2xl:text-sm">
          <Cake className="h-4 w-4 stroke-1" />
          {t("dateOfBirth")}
        </span>
        <span>
          {student.dateOfBirth &&
            dateFormatter.format(new Date(student.dateOfBirth))}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CakeSlice className="h-4 w-4 stroke-1" />
          {t("placeOfBirth")}
        </span>
        <span>{student.placeOfBirth || "N/A"}</span>
      </div>
      <Separator className="my-2 w-full" />
      <div className="grid grid-cols-2 gap-y-3 xl:grid-cols-4">
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <House className="h-4 w-4 stroke-1" />
          {t("residence")}
        </span>
        <span>{student.residence || "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CalendarPlus className="h-4 w-4 stroke-1" />
          {t("dateOfEntry")}
        </span>
        <span>
          {student.dateOfEntry
            ? dateFormatter.format(new Date(student.dateOfEntry))
            : "N/A"}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CalendarMinus className="h-4 w-4 stroke-1" />
          {t("dateOfExit")}
        </span>
        <span>
          {" "}
          {student.dateOfExit
            ? dateFormatter.format(new Date(student.dateOfExit))
            : "N/A"}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <Phone className="h-4 w-4 stroke-1" />
          {t("phoneNumber")}
        </span>
        <span>{student.phoneNumber || "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <AtSign className="h-4 w-4 stroke-1" />
          {t("email")}
        </span>
        <span>{student.email || "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CircleUser className="h-4 w-4 stroke-1" />
          {t("userId")}
        </span>
        <span>{student.userId || "N/A"}</span>
      </div>
      <Separator className="my-2 w-full" />
      <div className="flex flex-row items-center justify-between">
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <School className="h-4 w-4 stroke-1" />
          {t("formerSchool")}
        </span>
        <span className="line-clamp-1">
          {student.formerSchool?.name || "N/A"}
        </span>
      </div>

      <Separator className="my-2 w-full" />
      <div className="grid w-full justify-between md:flex">
        <ul className="grid w-[350px] gap-3">
          <li className="flex items-center justify-between">
            <span className="flex flex-row items-center gap-1 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 stroke-1" /> {t("is_active")}?
            </span>
            <span>
              {student.isActive ? (
                <FlatBadge className="w-[40px] justify-center" variant="green">
                  {t("yes")}
                </FlatBadge>
              ) : (
                <FlatBadge className="w-[40px] justify-center" variant="red">
                  {t("no")}
                </FlatBadge>
              )}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex flex-row items-center gap-1 text-muted-foreground">
              <BookHeart className="h-4 w-4 stroke-1" /> {t("parentDivorced")}?
            </span>
            <span>
              {student.parentDivorced ? (
                <FlatBadge className="w-[40px] justify-center" variant="red">
                  {t("yes")}
                </FlatBadge>
              ) : (
                "N/A"
              )}
            </span>
          </li>
        </ul>
        <ul className="grid w-[350px] gap-3">
          {siblings &&
            siblings.map((sibling, index) => {
              return (
                <li
                  key={`${index}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground">{`${t("sibling")} ${index + 1}`}</span>
                  <Link
                    className="flex flex-row items-center gap-1 hover:text-blue-500 hover:underline"
                    href={routes.students.details(sibling.id)}
                  >
                    <span className="truncate capitalize">
                      {sibling.lastName?.toLowerCase()}{" "}
                    </span>
                    <ExternalLink className="h-4 w-4 bg-muted" />
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <Separator className="my-2 w-full" />
      <div className="w-full">
        <Suspense
          key={id}
          fallback={<DataTableSkeleton columnCount={8} rowCount={3} />}
        >
          <StudentContactTable studentId={id} />
        </Suspense>
      </div>
      <Separator className="my-2 w-full" />
      <div className="flex w-full flex-col items-start">
        <span className="font-semibold">{t("observation")}</span>
        <span>{student.observation || "N/A"}</span>
      </div>
    </div>
  );
}
