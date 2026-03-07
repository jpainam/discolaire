import { differenceInCalendarDays, format } from "date-fns";
import { getTranslations } from "next-intl/server";

import { AvatarState } from "~/components/AvatarState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { caller } from "~/trpc/server";

function getBorrowerName(loan: {
  student: { firstName: string | null; lastName: string | null } | null;
  staff: { firstName: string | null; lastName: string | null } | null;
  contact: { firstName: string | null; lastName: string | null } | null;
}): string {
  const person = loan.student ?? loan.staff ?? loan.contact;
  if (!person) return "—";
  return `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim() || "—";
}

export async function RecentBorrows({ className }: { className?: string }) {
  const t = await getTranslations();
  const result = await caller.library.loans({ pageSize: 5 });
  const recents = result.data.map((loan) => ({
    name: getBorrowerName(loan),
    book: loan.book.title,
    avatar: "",
    date: loan.borrowed,
  }));

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
                  <p className="text-sm leading-none font-medium">
                    {borrow.name}
                  </p>
                  <p className="text-muted-foreground text-sm">{borrow.book}</p>
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
  const t = await getTranslations();

  let label: string;
  switch (diff) {
    case 0:
      label = t("Today");
      break;
    case 1:
      label = t("yesterday");
      break;
    case 2:
      label = t("2_days_ago");
      break;
    case 3:
      label = t("3_days_ago");
      break;
    default:
      label = format(date, "d MMM yyyy");
  }

  return <div className="text-muted-foreground ml-auto text-sm">{label}</div>;
}
