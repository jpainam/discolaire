import { getServerTranslations } from "@/app/i18n/server";
import MakePaymentStepper from "@/components/students/transactions/create";
import MakePaymentToolbar from "@/components/students/transactions/create/MakePaymentToolbar";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex w-full flex-col gap-2">
      <MakePaymentToolbar />
      <MakePaymentStepper />
    </div>
  );
}
