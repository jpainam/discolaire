import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { Mail, MessageSquare, Phone, TriangleAlert } from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { SubscriptionPlans } from "./SubscriptionPlans";
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { t } = await getServerTranslations();
  const params = await props.params;
  const totals = await caller.user.subscription(params.id);
  const totalUsed = [
    {
      title: "Email",
      total: totals?.email ?? 0,
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Whatsapp",
      total: totals?.whatsapp ?? 0,
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "SMS",
      total: totals?.sms ?? 0,
      icon: <Phone className="h-5 w-5 text-green-500" />,
    },
  ];
  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-3">
        {totalUsed.map((item) => {
          const used = item.total;
          const limit = 500;
          return (
            <Card key={item.title} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="space-x-2 flex flex-row items-center">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {used} used
                  </span>
                  <Badge
                    variant={
                      item.total == -1
                        ? "outline"
                        : item.total > 90
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {item.total == -1 ? "Unlimited" : `${used}/${limit}`}
                  </Badge>
                </div>
                <Progress
                  value={(item.total / limit) * 100}
                  className={`h-2 ${
                    item.total == -1
                      ? "bg-green-100"
                      : item.total > 90
                        ? "bg-red-100"
                        : "bg-gray-100"
                  }`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
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
