// import { subMonths } from "date-fns";
// import { School, Users } from "lucide-react";

import { ArrowDown, ArrowUp } from "lucide-react";

// import { cn } from "~/lib/utils";
// import { caller } from "~/trpc/server";
// import { CountCard } from "./CountCard";

// export async function QuickStatistics({ className }: { className?: string }) {
//   const studentCount = await caller.student.count();
//   const staffCount = await caller.staff.count();
//   const classroomCount = await caller.classroom.all();
//   const contactCount = await caller.contact.count();
//   const classroomTotal = classroomCount.length;
//   const newClassrooms = classroomCount.filter(
//     (classroom) => classroom.createdAt >= subMonths(new Date(), 1),
//   ).length;
//   const { t } = await getServerTranslations();
//   return (
//     <div
//       className={cn(
//         "grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar",
//         className,
//       )}
//     >
//       <CountCard
//         title={t("total_students")}
//         count={studentCount.total}
//         icon={Users}
//         percentage={(studentCount.new / studentCount.total) * 100}
//       />

//       <CountCard
//         title={t("total_staffs")}
//         count={staffCount.total}
//         icon={Users}
//         percentage={(staffCount.new / staffCount.total) * 100}
//       />
//       <CountCard
//         title={t("total_classrooms")}
//         count={classroomTotal}
//         icon={School}
//         percentage={(newClassrooms / classroomTotal) * 100}
//       />
//       <CountCard
//         title={t("total_contacts")}
//         count={contactCount.total}
//         icon={Users}
//         percentage={(contactCount.new / contactCount.total) * 100}
//       />
//     </div>
//   );
// }

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import FlatBadge from "../FlatBadge";

// const stats = [
//   {
//     title: "All Orders",
//     value: 122380,
//     delta: 15.1,
//     lastMonth: 105922,
//     positive: true,
//     prefix: "",
//     suffix: "",
//   },
//   {
//     title: "Order Created",
//     value: 1902380,
//     delta: -2.0,
//     lastMonth: 2002098,
//     positive: false,
//     prefix: "",
//     suffix: "",
//   },
//   {
//     title: "Organic Sales",
//     value: 98100000,
//     delta: 0.4,
//     lastMonth: 97800000,
//     positive: true,
//     prefix: "$",
//     suffix: "M",
//     format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
//     lastFormat: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
//   },
//   {
//     title: "Active Users",
//     value: 48210,
//     delta: 3.7,
//     lastMonth: 46480,
//     positive: true,
//     prefix: "",
//     suffix: "",
//   },
// ];

export async function QuickStatistics() {
  const enrolled = await caller.enrollment.count({});
  const classrooms = await caller.classroom.all();
  const contactCount = await caller.contact.count();

  const staffCount = await caller.staff.count();
  const { t } = await getServerTranslations();
  const stats = [
    {
      title: t("total_students"),
      value: enrolled.total,
      delta: (enrolled.new / (enrolled.total || 1e9)) * 100,
      lastMonth: enrolled.totalLastYear,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_staffs"),
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
      lastMonth: classrooms.length,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_contacts"),
      value: enrolled.contactCount,
      delta: (contactCount.new / (contactCount.total || 1e9)) * 100,
      lastMonth: contactCount.total,
      positive: true,
      prefix: "",
      suffix: "",
    },
  ];
  return (
    <div className="col-span-full grid grow grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="">
          <CardHeader className="border-0">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
            {/* <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant={"ghost"} className="-me-1.5">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem>
                      <Settings />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlert /> Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin /> Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction> */}
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-foreground text-2xl font-medium tracking-tight">
                {stat.value.toLocaleString()}
              </span>
              <FlatBadge variant={stat.positive ? "green" : "red"}>
                {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                {stat.delta.toFixed(2)}%
              </FlatBadge>
            </div>
            <div className="text-muted-foreground mt-2 border-t pt-2.5 text-xs">
              Vs l'année dernière:{" "}
              <span className="text-foreground font-medium">
                {stat.lastMonth.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
