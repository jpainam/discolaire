import { CircleDollarSign } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Label } from "@repo/ui/label";

import { Step1 } from "~/components/students/transactions/create/step1";
import { Step2 } from "~/components/students/transactions/create/step2";
import { api } from "~/trpc/server";

export default async function Page({
  searchParams: { amount, description, transactionType, paymentMethod },
  params: { id },
}: {
  searchParams: {
    amount: string;
    description: string;
    transactionType: string;
    paymentMethod: string;
  };
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  const classroom = await api.student.classroom({ studentId: id });
  const isStep2 = amount && description && transactionType && paymentMethod;
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center border-b bg-secondary px-2 py-2 text-secondary-foreground">
        <CircleDollarSign className="mr-2 h-4 w-4" />
        <Label className="py-2"> {t("make_payment")}</Label>
      </div>
      {!classroom ? (
        <EmptyState className="my-8" title={t("student_not_registered_yet")} />
      ) : (
        <>
          {isStep2 ? (
            <Step2
              amount={Number(amount)}
              paymentMethod={paymentMethod}
              transactionType={transactionType}
              description={description}
              classroomId={classroom.id}
            />
          ) : (
            <Step1 />
          )}
        </>
      )}
    </div>
  );
}
