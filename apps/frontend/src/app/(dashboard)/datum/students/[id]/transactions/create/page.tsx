import { CircleDollarSign } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";

import MakePaymentStepper from "~/components/students/transactions/create";
import { StudentFeeType } from "~/components/students/transactions/StudentFeeType";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="border-b bg-secondary px-2 py-2 text-secondary-foreground">
        <CircleDollarSign className="mr-2 h-4 w-4" />
        <Label> {t("make_payment")}</Label>
      </div>
      <div className="grid flex-row items-start gap-4 px-2 xl:flex">
        <MakePaymentStepper />
        <StudentFeeType />
      </div>
    </div>
  );
}
