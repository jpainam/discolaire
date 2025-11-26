import {
  ContactRoundIcon,
  HouseIcon,
  SquareUserIcon,
  UserRound,
} from "lucide-react";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export async function QuickStatistics() {
  const enrolled = await caller.enrollment.count({});
  const classrooms = await caller.classroom.all();
  const contactCount = await caller.contact.count();

  const staffCount = await caller.staff.count();
  const { t } = await getServerTranslations();
  const stats = [
    {
      title: t("total_students"),
      icon: UserRound,
      value: enrolled.total,
      delta: (enrolled.new / (enrolled.total || 1e9)) * 100,
      lastMonth: enrolled.totalLastYear,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_staffs"),
      icon: SquareUserIcon,
      value: staffCount.total,
      delta: 0,
      lastMonth: staffCount.total,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_classrooms"),
      value: classrooms.length,
      delta: 0,
      icon: HouseIcon,
      lastMonth: classrooms.length,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_contacts"),
      icon: ContactRoundIcon,
      value: enrolled.contactCount,
      delta: (contactCount.new / (contactCount.total || 1e9)) * 100,
      lastMonth: contactCount.total,
      positive: true,
      prefix: "",
      suffix: "",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((st, index) => {
        const Icon = st.icon;
        return (
          <div
            key={index}
            className="border-border bg-card relative overflow-hidden rounded-xl border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">{st.title}</p>
                <p className="text-foreground text-2xl font-medium">
                  {st.value.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted border-border flex size-16 items-center justify-center rounded-lg border">
                <Icon className="text-muted-foreground size-8" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
