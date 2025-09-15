import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentContactListSheet({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const t = useTranslations();

  const studentQuery = useQuery(trpc.student.get.queryOptions(studentId));
  const studentContacts = useQuery(
    trpc.student.contacts.queryOptions(studentId),
  );
  if (studentQuery.isPending || studentContacts.isPending) {
    return (
      <div className="flex flex-row justify-center py-8">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  const student = studentQuery.data;
  const contacts = studentContacts.data;
  if (!contacts || contacts.length === 0) {
    return (
      <div className="p-4">
        {getFullName(student)} n'a pas de contacts/parent.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 px-4 py-8 text-xs">
      <h1 className="text-lg font-bold">Les contacts/parents</h1>
      <div className="text-md font-bold">
        {t("student")} : {getFullName(student)}
      </div>
      {contacts.map((c, index) => {
        return (
          <div key={index} className="flex flex-col gap-4 border-b">
            <div className="flex flex-col gap-2">
              <span>{t("fullName")}</span>
              <span>{getFullName(c.contact)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>{t("relationship")}</span>
              <span>{c.relationship?.name}</span>
            </div>
            <div className="flex flex-col gap-3">
              <span>
                {t("phone")} - {t("email")}
              </span>
              <span>
                {c.contact.phoneNumber1} / {c.contact.phoneNumber2} -{" "}
                {c.contact.user?.email}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span>{t("address")}</span>
              <span>{c.contact.address ?? "N/A"}</span>
            </div>
            <div className="mb-3"></div>
          </div>
        );
      })}
    </div>
  );
}
