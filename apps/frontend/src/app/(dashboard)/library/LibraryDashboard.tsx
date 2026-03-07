import { BookMarked, BookOpen, Clock, UsersIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { caller } from "~/trpc/server";
import { BookDashboardDataTable } from "./BookDashboardDataTable";
import { LibraryStatsGrid } from "./LibraryStatsGrid";
import { MonthlyActivities } from "./MonthlyActivities";
import { RecentBorrows } from "./RecentBorrows";

export async function LibraryDashboard() {
  const counts = await caller.library.count();
  const t = await getTranslations();
  return (
    <div className="flex-1">
      <LibraryStatsGrid
        stats={[
          {
            title: t("total_books"),
            value: `${counts.book}`,
            icon: <BookMarked />,
          },
          {
            title: t("books_borrowed"),
            value: `${counts.borrowed}`,
            icon: <BookOpen />,
          },
          {
            title: t("active_users"),
            value: `${counts.activeUser}`,
            icon: <UsersIcon />,
          },
          {
            title: t("overdue_books"),
            value: `${counts.overdueBook}`,
            icon: <Clock />,
          },
        ]}
      />
      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlyActivities className="col-span-4" />
        <RecentBorrows className="col-span-3" />
        <div className="col-span-full">
          <BookDashboardDataTable />
        </div>
      </div>
    </div>
  );
}
