import { CircleDollarSign } from "lucide-react";

import { Label } from "@repo/ui/components/label";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { Step1 } from "~/components/students/transactions/create/step1";
import { Step2 } from "~/components/students/transactions/create/step2";
import { api } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{
    amount: string;
    description: string;
    transactionType: string;
    paymentMethod: string;
  }>;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const searchParams = await props.searchParams;

  const { amount, description, transactionType, paymentMethod } = searchParams;

  const { t } = await getServerTranslations();
  const studentContacts = await api.student.contacts(id);
  const classroom = await api.student.classroom({ studentId: id });
  const isStep2 = amount && description && transactionType && paymentMethod;
  //const school = await api.school.getSchool();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center border-y bg-secondary px-2 py-2 text-secondary-foreground">
        <CircleDollarSign className="mr-2 h-4 w-4" />
        <Label className="py-1.5"> {t("make_payment")}</Label>
      </div>
      {!classroom ? (
        <EmptyState className="my-8" title={t("student_not_registered_yet")} />
      ) : (
        <>
          {isStep2 ? (
            <>
              <Step2
                amount={Number(amount)}
                paymentMethod={paymentMethod}
                transactionType={transactionType}
                description={description}
                classroomId={classroom.id}
                contacts={studentContacts}
              />
            </>
          ) : (
            <Step1 />
          )}
        </>
      )}
    </div>
  );
}
