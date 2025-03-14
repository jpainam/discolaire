import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Link from "next/link";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
export async function StudentDashboardContact({
  studentId,
}: {
  studentId: string;
}) {
  const { t } = await getServerTranslations();
  const studentContacts = await api.student.contacts(studentId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("student_contacts")}</CardTitle>
        <CardDescription>{t("student_contact_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {studentContacts.map((stdc, index) => {
          const contact = stdc.contact;
          return (
            <div
              key={index}
              className="flex flex-row justify-between border-b py-2 items-center"
            >
              <div className="flex  flex-row gap-2 ">
                <AvatarState
                  avatar={contact.avatar}
                  className="w-[75px] h-[75px] "
                  pos={getFullName(contact).length}
                />
                <div className="flex  flex-col gap-3">
                  <h2 className="font-semibold">{getFullName(contact)}</h2>
                  <div className="flex flex-row gap-2 text-muted-foreground">
                    <p>{contact.email}</p>
                    <p>
                      {contact.phoneNumber1} / {contact.phoneNumber2}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/staffs/${contact.id}`}
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
