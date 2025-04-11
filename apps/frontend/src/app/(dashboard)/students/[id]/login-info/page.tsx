import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

import { LoginInfoHeader } from "~/components/students/login-info/LoginInfoHeader";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";
import { AttachUserButton } from "./AttachUserButton";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t } = await getServerTranslations();
  const student = await caller.student.get(id);
  const studentcontacts = await caller.student.contacts(id);

  return (
    <div className="flex flex-col text-sm">
      <LoginInfoHeader />
      <div className="flex flex-col gap-2 px-4 mb-4">
        <Separator />
        <div className="font-bold">{t("loginInformation")}</div>
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
          {t("loginInfoDescription1")} {t("loginInfoDescription2")}
        </div>
        <div className="mb-4 flex flex-col items-start justify-start gap-1 px-4">
          <div className="flex flex-row gap-4">
            <FlatBadge className="flex w-6 items-center" variant={"green"}>
              1{" "}
            </FlatBadge>
            {t("loginInfo1")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"red"}>2</FlatBadge>
            {t("loginInfo2")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"purple"}>3</FlatBadge>
            {t("loginInfo3")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"blue"}>4</FlatBadge>
            {t("loginInfo4")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"yellow"}>5</FlatBadge>
            {t("loginInfo5")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"gray"}>6</FlatBadge>
            {t("loginInfo6")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"pink"}>7</FlatBadge>
            {t("loginInfo7")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"indigo"}>8</FlatBadge>
            {t("loginInfo8")}
          </div>
          <div className="flex flex-row gap-4">
            <FlatBadge variant={"red"}>2</FlatBadge>
            {t("loginInfo9")}
          </div>
        </div>
        <Separator />
        <div>{t("loginInfoDescription3")}</div>

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
            <AttachUserButton
              entityId={student.id}
              type={"student"}
              userId={student.userId ?? undefined}
              username={student.user?.username}
            />
          </TabsContent>
          {studentcontacts.map((std, _index) => (
            <TabsContent
              key={`content-${std.contactId}`}
              value={`contact-${std.contactId}`}
            >
              <AttachUserButton
                entityId={std.contactId}
                type={"contact"}
                userId={std.contact.userId ?? undefined}
                username={std.contact.user?.username}
              />
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex flex-row items-center gap-2">
          <span className="font-bold">{t("note")}: </span>
          <span>{t("thePasswordIsCaseSensitive")}</span>
        </div>
        <div>{t("loginInfoDescription4")}</div>
        <Separator className="my-4" />
        <div>{t("loginInfoDescription5")}</div>
      </div>
    </div>
  );
}
