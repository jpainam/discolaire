import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  AlertCircle,
  Mail,
  MessageSquare,
  MessageSquareText,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { caller } from "~/trpc/server";
import { SubscriptionPlans } from "./SubscriptionPlans";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const t = await getTranslations();
  const params = await props.params;

  const subscription = await caller.user.subscription(params.id);
  const plans = [
    {
      name: "hobby",
      sms: 10,
      email: 50,
      whatsapp: 0,
    },
    {
      name: "pro",
      email: 200,
      sms: 30,
      whatsapp: 30,
    },
    {
      name: "full",
      email: 10000,
      sms: 10000,
      whatsapp: 10000,
    },
  ];
  const plan = plans.find((plan) => plan.name === subscription?.plan);
  const totalUsed = [
    {
      title: "Email",
      total: 0, //subscription?.email ?? 0,
      limit: plan?.email ?? 0,
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Whatsapp",
      total: 0, //subscription?.whatsapp ?? 0,
      limit: plan?.whatsapp ?? 0,
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    },
    {
      title: "SMS",
      total: 0, //subscription?.sms ?? 0,
      limit: plan?.sms ?? 0,
      icon: <MessageSquareText className="h-5 w-5 text-purple-500" />,
    },
  ];
  return (
    <div className="grid gap-2 px-4 py-2">
      <div className="grid gap-4 md:grid-cols-3">
        {totalUsed.map((item) => {
          return (
            <Card key={item.title} className="gap-4 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex flex-row items-center space-x-1">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {item.limit - item.total} {t("used")}
                  </span>
                  <Badge
                    variant={
                      item.total == -1
                        ? "outline"
                        : item.total > (3 / 4) * item.limit
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {item.total == -1
                      ? t("Unlimited")
                      : `${item.total}/${item.limit}`}
                  </Badge>
                </div>
                <Progress
                  value={(item.total / item.limit) * 100}
                  className={`h-2 ${
                    item.total == -1
                      ? "bg-green-600"
                      : item.total > 90
                        ? "bg-red-600"
                        : "bg-gray-600"
                  }`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert variant={subscription ? "default" : "destructive"}>
        {subscription ? (
          <InfoCircledIcon className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {subscription ? t("Active subscription") : t("no_subscription_plan")}
        </AlertTitle>
        <AlertDescription>
          {subscription ? (
            subscription.plan
          ) : (
            <span>
              {t("contact_your_school_for_paiement_and_subscription")}
            </span>
          )}
        </AlertDescription>
      </Alert>

      <SubscriptionPlans plan={subscription?.plan ?? "hobby"} />
    </div>
  );
}
