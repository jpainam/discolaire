import { notFound } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";

import { getServerTranslations } from "~/app/i18n/server";
import { AvatarState } from "~/components/AvatarState";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

export async function StaffProfile({ staffId }: { staffId: string }) {
  const staff = await api.staff.get({ id: staffId });

  const { t, i18n } = await getServerTranslations();
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
  });
  if (!staff) {
    notFound();
  }

  return (
    <div className="mx-2">
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-start gap-4 border-b bg-muted/50">
          <AvatarState
            className="h-[100px] w-[100px] xl:h-[200px] xl:w-[200px]"
            avatar={staff?.avatar}
            pos={getFullName(staff).length}
          />
          <div className="flex flex-col gap-4">
            <Button variant={"outline"}>{t("change_avatar")}</Button>
          </div>
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
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  {staff.dateOfBirth &&
                    dateFormatter.format(new Date(staff.dateOfBirth))}
                  {!staff.dateOfBirth && "N/A"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">{t("dateOfHire")}</dt>
                <dd>
                  {staff.dateOfHire &&
                    dateFormatter.format(new Date(staff.dateOfHire))}
                  {!staff.dateOfHire && "N/A"}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="grid gap-2">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-2">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>Liam Johnson</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
