import { CircleDollarSign } from "lucide-react";

import { Label } from "@repo/ui/components/label";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { AlertState } from "~/components/AlertState";
import { CreateTransaction } from "~/components/students/transactions/create/CreateTransaction";
import { CreateTransactionContextProvider } from "~/components/students/transactions/create/CreateTransactionContextProvider";
import { api, caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t } = await getServerTranslations();

  const classroom = await api.student.classroom({ studentId: id });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const studentContacts = await api.student.contacts(id);
  const fees = await caller.classroom.fees(classroom.id);
  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(params.id);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center border-b bg-secondary px-2 py-2 text-secondary-foreground">
        <CircleDollarSign className="mr-2 h-4 w-4" />
        <Label className="py-1.5"> {t("make_payment")}</Label>
      </div>

      {unpaidRequiredFees.length !== 0 && (
        <AlertState variant="warning">{t("required_fee_warning")}</AlertState>
      )}
      <CreateTransactionContextProvider
        studentContacts={studentContacts}
        fees={fees}
        unpaidRequiredFees={unpaidRequiredFees}
        classroom={classroom}
      >
        <CreateTransaction />
      </CreateTransactionContextProvider>
    </div>
  );
}
