import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { differenceInCalendarDays, format } from "date-fns";
import { AvatarState } from "~/components/AvatarState";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
export async function RecentBorrows({ className }: { className?: string }) {
  const { t } = await getServerTranslations();
  const borrows = await caller.library.borrowBooks({});
  const recents = borrows.slice(0, 5).map((borrow) => {
    return {
      name: borrow.user.name ?? borrow.user.email ?? borrow.user.username,
      book: borrow.book.title,
      avatar: borrow.user.avatar,
      date: borrow.borrowed,
    };
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("recent_borrows")}</CardTitle>
        <CardDescription>{t("recent_borrows_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recents.length === 0 && (
            <p className="text-muted-foreground">{t("no_data")}</p>
          )}
          {recents.map((borrow, index) => {
            return (
              <div key={index} className="flex items-center">
                <AvatarState pos={borrow.name.length} avatar={borrow.avatar} />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {borrow.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{borrow.book}</p>
                </div>
                <RelativeDayLabel date={borrow.date} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
async function RelativeDayLabel({ date }: { date: Date }) {
  const today = new Date();
  const diff = differenceInCalendarDays(today, date);
  const { t } = await getServerTranslations();
  let label = "";
  switch (diff) {
    case 0:
      label = "today";
      break;
    case 1:
      label = "yesterday";
      break;
    case 2:
      label = "2_days_ago";
      break;
    case 3:
      label = "3_days_ago";
      break;
    default:
      label = format(date, "MMMM d, yyyy");
  }
  return (
    <div className="ml-auto text-muted-foreground text-sm">{t(label)}</div>
  );
}
