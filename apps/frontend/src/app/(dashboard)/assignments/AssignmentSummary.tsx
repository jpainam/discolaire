import { format } from "date-fns";
import { CalendarIcon, ListTodo, PieChart, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export async function AssignmentSummary() {
  const t = await getTranslations();
  return (
    <div className="mb-8 grid gap-6 px-2 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("total_assignments")}
          </CardTitle>
          <ListTodo className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{10}</div>
          <p className="text-muted-foreground text-xs">
            {t("number_from_last_week", { n: "+2" })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("pending_submissions")}
          </CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-muted-foreground text-xs">
            {t("across_all_assignments")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("upcoming_due_date")}
          </CardTitle>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(new Date(), "MMM dd")}
          </div>
          <p className="text-muted-foreground text-xs">
            {t("next_assignment_due")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("average_completion_rate")}
          </CardTitle>
          <PieChart className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15 %</div>
          <p className="text-muted-foreground text-xs">
            {t("across_all_assignments")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
