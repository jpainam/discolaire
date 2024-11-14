import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";

import { AvatarState } from "~/components/AvatarState";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";
import { StaffProfileHeader } from "./StaffProfileHeader";

export async function StaffProfile({ staffId }: { staffId: string }) {
  const staff = await api.staff.get(staffId);

  const { t, i18n } = await getServerTranslations();
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
    timeZone: "UTC",
  });
  if (!staff) {
    notFound();
  }

  return (
    <div className="mx-2">
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-start gap-4 border-b bg-muted/50">
          <AvatarState
            className="h-[50px] w-[50px] xl:h-[100px] xl:w-[100px]"
            avatar={staff.avatar}
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
                <span>{staff.email}</span>
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
    </div>
  );
}
