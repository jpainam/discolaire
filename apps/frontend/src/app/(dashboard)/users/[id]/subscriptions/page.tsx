import { TriangleAlert } from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { SubscriptionPlans } from "./SubscriptionPlans";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="p-4">
      {/* <CurrentSubscription /> */}
      <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
        <p className="text-md">
          <TriangleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={24}
            aria-hidden="true"
          />
          {t("no_subscription_plan")}
        </p>
      </div>

      <SubscriptionPlans />
    </div>
  );
}
