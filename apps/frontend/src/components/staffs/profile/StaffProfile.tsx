"use client";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

import { AvatarState } from "~/components/AvatarState";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import EmailVerification from "~/components/EmailComponent";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { StaffProfileHeader } from "./StaffProfileHeader";

export function StaffProfile() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: staff } = useSuspenseQuery(
    trpc.staff.get.queryOptions(params.id)
  );

  const { t, i18n } = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
    timeZone: "UTC",
  });

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row items-start gap-4 py-4 border-b bg-muted/50">
        <AvatarState
          avatar={staff.user?.avatar}
          className="h-[50px] w-[50px] xl:h-[100px] xl:w-[100px]"
          pos={getFullName(staff).length}
        />

        <StaffProfileHeader staff={staff} />
      </CardHeader>
      <CardContent className="p-2 text-sm">
        <div className="grid gap-2">
          <div className="font-semibold">{t("details")}</div>
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("lastName")}</span>
              <span>{staff.lastName}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("firstName")}</span>
              <span>{getFullName(staff)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("email")}</span>
              <span>{staff.user?.email}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("phoneNumber")} 1
              </span>
              <span>
                <a href="tel:">{staff.phoneNumber1}</a>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("phoneNumber")} 2{" "}
              </span>
              <span>
                <a href="tel:">{staff.phoneNumber2}</a>
              </span>
            </li>
          </ul>
          {staff.user?.email && (
            <EmailVerification
              email={staff.user.email}
              isVerified={staff.user.emailVerified}
            />
          )}
          <Separator className="my-2" />
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("jobTitle")}</span>
              <span>{staff.jobTitle}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("employmentType")}
              </span>
              <span>{staff.employmentType}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("educationLevel")}
              </span>
              <span>{staff.jobTitle}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("degree")}</span>
              <span>{staff.degree?.name}</span>
            </li>
          </ul>
        </div>

        <Separator className="col-span-full my-4" />
        <div className="grid gap-2">
          <div className="font-semibold">{t("otherInformation")}</div>
          <dl className="grid gap-2">
            {/* <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t("email")}</dt>
                <dd>
                  {staff.dateOfBirth && dateFormatter.format(staff.dateOfBirth)}
                </dd>
              </div> */}
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t("dateOfHire")}</dt>
              <dd>
                {staff.dateOfHire &&
                  dateFormatter.format(new Date(staff.dateOfHire))}
                {!staff.dateOfHire && "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
