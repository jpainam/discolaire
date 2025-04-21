import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import {
  AlertCircle,
  Mail,
  MessageSquare,
  MessageSquareText,
} from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { SubscriptionPlans } from "./SubscriptionPlans";
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { t } = await getServerTranslations();
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
      total: subscription?.email ?? 0,
      limit: plan?.email ?? 0,
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Whatsapp",
      total: subscription?.whatsapp ?? 0,
      limit: plan?.whatsapp ?? 0,
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    },
    {
      title: "SMS",
      total: subscription?.sms ?? 0,
      limit: plan?.sms ?? 0,
      icon: <MessageSquareText className="h-5 w-5 text-purple-500" />,
    },
  ];
  return (
    <div className="px-4 py-2 grid gap-2">
      <div className="grid gap-4 md:grid-cols-3">
        {totalUsed.map((item) => {
          return (
            <Card key={item.title} className="overflow-hidden gap-4">
              <CardHeader>
                <CardTitle className="space-x-1 flex flex-row items-center">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">
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
