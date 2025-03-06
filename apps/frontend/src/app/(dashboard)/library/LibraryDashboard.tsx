import { BookMarked, BookOpen, Clock, UsersIcon } from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { LibraryStatsGrid } from "./LibraryStatsGrid";

export async function LibraryDashboard() {
  const counts = await api.library.count();
  const { t } = await getServerTranslations();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <LibraryStatsGrid
        className="mx-4 mt-2"
        stats={[
          {
            title: t("total_books"),
            value: `${counts.books}`,
            change: {
              value: "+100%",
              trend: "up",
            },
            icon: <BookMarked />,
          },
          {
            title: t("books_borrowed"),
            value: `${counts.borrowed}`,
            change: {
              value: "+100%",
              trend: "up",
            },
            icon: <BookOpen />,
          },
          {
            title: t("active_users"),
            value: `${counts.activeUser}`,
            change: {
              value: "+100%",
              trend: "up",
            },
            icon: <UsersIcon />,
          },
          {
            title: t("overdue_books"),
            value: `${counts.overdueBook}`,
            change: {
              value: "-17%",
              trend: "down",
            },
            icon: <Clock />,
          },
        ]}
      />
    </div>
  );
}
