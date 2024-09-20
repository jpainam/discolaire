import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { LoginInfoHeader } from "~/components/students/login-info/LoginInfoHeader";
import { UserLoginCard } from "~/components/students/login-info/UserLoginCard";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t: t2 } = await getServerTranslations("description");
  const { t } = await getServerTranslations();
  const student = await api.student.get(id);
  const studentcontacts = await api.student.contacts(id);
  //const user = student.userId ? await api.user.get(student.userId) : null;

  return (
    <div className="flex flex-col text-sm">
      <LoginInfoHeader />
      <div className="flex flex-col gap-2 px-2">
        <Separator />
        <div className="font-bold">{t2("loginInformation")}</div>
        <Separator />
        <div className="flex flex-row items-center gap-4">
          <Label className="w-[150px] font-semibold">{t("fullName")}</Label>
          <span>{getFullName(student)}:</span>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Label className="w-[150px] font-semibold">
            {t("registration_number")}:
          </Label>
          <span>{student.registrationNumber ?? "N/A"}</span>
        </div>
        <div className="flex flex-wrap">
          {t2("loginInfoDescription1")} {t2("loginInfoDescription2")}
        </div>
        <div className="mb-4 flex flex-col items-start justify-start gap-1 px-4">
          <div className="flex flex-row gap-4">
            <FlatBadge className="flex w-6 items-center" variant={"green"}>
              1{" "}
            </FlatBadge>
            {t2("loginInfo1")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"red"}>2</FlatBadge>
            {t2("loginInfo2")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"purple"}>3</FlatBadge>
            {t2("loginInfo3")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"blue"}>4</FlatBadge>
            {t2("loginInfo4")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"yellow"}>5</FlatBadge>
            {t2("loginInfo5")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"gray"}>6</FlatBadge>
            {t2("loginInfo6")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"pink"}>7</FlatBadge>
            {t2("loginInfo7")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"indigo"}>8</FlatBadge>
            {t2("loginInfo8")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"red"}>2</FlatBadge>
            {t2("loginInfo9")}
          </div>
        </div>
        <Separator />
        <div>{t2("loginInfoDescription3")}</div>

        <Tabs defaultValue={`student-${student.id}`} className="w-[400px]">
          <TabsList>
            <TabsTrigger value={`student-${student.id}`}>
              {getFullName(student)}
            </TabsTrigger>
            {studentcontacts.map((std, _index) => (
              <TabsTrigger
                key={std.contactId}
                value={`contact-${std.contactId}`}
              >
                {getFullName(std.contact)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={`student-${student.id}`}>
            <Button>
              {student.userId ? t("create_user") : t("renitialize_password")}
            </Button>
          </TabsContent>
          {studentcontacts.map((std, _index) => (
            <TabsContent
              key={`content-${std.contactId}`}
              value={`contact-${std.contactId}`}
            >
              {std.contact.userId ? (
                <UserLoginCard userId={std.contact.userId} />
              ) : (
                <></>
              )}
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex flex-row items-center gap-2">
          <span className="font-bold">Note:</span>
          <span>{t2("thePasswordIsCaseSensitive")}</span>
        </div>
        <div>{t2("loginInfoDescription4")}</div>
        <Separator className="my-4" />
        <div>{t2("loginInfoDescription5")}</div>
      </div>
    </div>
  );
}
