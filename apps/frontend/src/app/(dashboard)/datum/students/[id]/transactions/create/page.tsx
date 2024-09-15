import { getServerTranslations } from "@repo/i18n/server";

import MakePaymentStepper from "~/components/students/transactions/create";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="border-b bg-secondary px-2 py-2 text-secondary-foreground">
        {t("make_payment")}
      </div>
      <MakePaymentStepper />
    </div>
  );
}
