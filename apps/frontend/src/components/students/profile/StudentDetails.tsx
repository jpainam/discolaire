"use client";

import {
  AtSign,
  BookHeart,
  BoxesIcon,
  Cake,
  CakeSlice,
  CalendarMinus,
  CalendarPlus,
  CircleUser,
  ExternalLink,
  MedalIcon,
  Phone,
  School,
  SquareUserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PiChurchDuotone } from "react-icons/pi";

import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { decode } from "entities";
import House from "~/components/icons/house";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";

export default function StudentDetails() {
  const params = useParams<{ id: string }>();
  const { t, i18n } = useLocale();

  const siblingsQuery = api.student.siblings.useQuery(params.id);
  const studentQuery = api.student.get.useQuery(params.id);

  if (studentQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 32 }).map((_, index) => (
          <Skeleton className="h-8" key={`student-profile-${index}`} />
        ))}
      </div>
    );
  }
  const student = studentQuery.data;
  if (!student) return null;
  const siblings = siblingsQuery.data ?? [];
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-y-3 px-4 xl:grid-cols-4">
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <SquareUserRound className="h-4 w-4 stroke-1" /> {t("lastName")}
        </span>
        <span>{decode(student.lastName ?? "")}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <SquareUserRound className="h-4 w-4 stroke-1" />
          {t("firstName")}
        </span>
        <span>{decode(student.firstName ?? "")} </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <PiChurchDuotone className="h-4 w-4 stroke-1" />
          {t("religion")}
        </span>
        <span>{student.religion ? student.religion.name : "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <Cake className="h-4 w-4 stroke-1" />
          {t("dateOfBirth")}
        </span>
        <span>
          {student.dateOfBirth && dateFormat.format(student.dateOfBirth)}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CakeSlice className="h-4 w-4 stroke-1" />
          {t("placeOfBirth")}
        </span>
        <span>{student.placeOfBirth ?? "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <BoxesIcon className="h-4 w-4 stroke-1" />
          {t("clubs")}
        </span>
        <span className="line-clamp-1 overflow-ellipsis">
          {student.clubs.map((club) => club.club.name).join(", ")}
        </span>
      </div>
      <Separator className="my-2 w-full" />
      <div className="grid grid-cols-2 gap-y-3 px-4 xl:grid-cols-4">
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <House className="h-4 w-4 stroke-1" />
          {t("residence")}
        </span>
        <span>{student.residence ?? "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CalendarPlus className="h-4 w-4 stroke-1" />
          {t("dateOfEntry")}
        </span>
        <span>
          {student.dateOfEntry && dateFormat.format(student.dateOfEntry)}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CalendarMinus className="h-4 w-4 stroke-1" />
          {t("dateOfExit")}
        </span>
        <span>
          {" "}
          {student.dateOfExit && dateFormat.format(student.dateOfExit)}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <Phone className="h-4 w-4 stroke-1" />
          {t("phoneNumber")}
        </span>
        <span>{student.phoneNumber ?? "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <AtSign className="h-4 w-4 stroke-1" />
          {t("email")}
        </span>
        <span>{student.email ?? "N/A"}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <CircleUser className="h-4 w-4 stroke-1" />
          {t("userId")}
        </span>
        <span>{student.userId ?? "N/A"}</span>
      </div>
      <Separator className="my-2 w-full" />
      <div className="grid grid-cols-2 gap-y-3 px-4 xl:grid-cols-4">
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <School className="h-4 w-4 stroke-1" />
          {t("formerSchool")}
        </span>
        <span className="line-clamp-1 overflow-ellipsis">
          {student.formerSchool?.name ?? "N/A"}
        </span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <BookHeart className="h-4 w-4 stroke-1" /> {t("hobbies")}
        </span>
        <span>{student.hobbies.join(", ")}</span>
        <span className="flex flex-row items-center gap-1 text-muted-foreground">
          <MedalIcon className="h-4 w-4 stroke-1" />
          {t("sports")}
        </span>
        <span>{student.sports.map((sp) => sp.sport.name).join(", ")}</span>
      </div>

      <Separator className="my-2 w-full" />
      <div className="grid w-full justify-between px-4 md:flex">
        {/*<ul className="grid w-[350px] gap-3">
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
        </ul>*/}
        <ul className="grid w-[350px] gap-3">
          {siblings.map((sibling, index) => {
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
      <div className="flex w-full flex-col items-start px-4">
        <span className="font-semibold">{t("observation")}</span>
        <span>{student.observation ?? "N/A"}</span>
      </div>
    </>
  );
}
