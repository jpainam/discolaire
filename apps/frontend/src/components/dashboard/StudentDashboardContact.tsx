import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";
import { AvatarState } from "../AvatarState";

export async function StudentDashboardContact({
  studentId,
}: {
  studentId: string;
}) {
  const { t } = await getServerTranslations();
  const studentContacts = await caller.student.contacts(studentId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("student_contacts")}</CardTitle>
        <CardDescription>{t("student_contact_description")}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs">
        {studentContacts.map((stdc, index) => {
          const contact = stdc.contact;
          return (
            <div
              key={index}
              className="flex flex-row items-center justify-between border-b py-2"
            >
              <div className="flex flex-row gap-2">
                <AvatarState
                  avatar={contact.user?.avatar}
                  pos={getFullName(contact).length}
                />
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="font-semibold hover:underline"
                  >
                    {getFullName(contact)}
                  </Link>
                  <div className="text-muted-foreground flex flex-row gap-2">
                    <p>{contact.user?.email}</p>
                    <p>
                      {contact.phoneNumber1} / {contact.phoneNumber2}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/contacts/${contact.id}`}
              >
                {t("details")}
              </Link>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
