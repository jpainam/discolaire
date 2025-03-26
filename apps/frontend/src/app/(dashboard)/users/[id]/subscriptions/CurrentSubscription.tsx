import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Mail, MessageSquare, Phone } from "lucide-react";

export function CurrentSubscription() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              Your active subscription plan and usage
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            Pro
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <UsageCard
              icon={<Mail className="h-5 w-5 text-blue-500" />}
              title="Emails"
              used={10}
              limit={100}
            />
            <UsageCard
              icon={<Phone className="h-5 w-5 text-green-500" />}
              title="SMS"
              used={10}
              limit={1000}
            />
            <UsageCard
              icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
              title="Messages"
              used={15}
              limit={1000}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageCard({
  icon,
  title,
  used,
  limit,
}: {
  icon: React.ReactNode;
  title: string;
  used: number;
  limit: number;
}) {
  const percentage =
    limit === Number.POSITIVE_INFINITY ? 0 : Math.round((used / limit) * 100);
  const isUnlimited = limit === Number.POSITIVE_INFINITY;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{used} used</span>
            <span>{isUnlimited ? "Unlimited" : `${limit} total`}</span>
          </div>
          {!isUnlimited && (
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${percentage > 80 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
