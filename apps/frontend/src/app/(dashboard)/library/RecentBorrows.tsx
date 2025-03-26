import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import { getServerTranslations } from "~/i18n/server";
export async function RecentBorrows({ className }: { className?: string }) {
  const { t } = await getServerTranslations();
  const recentBorrows = [
    {
      name: "Jackson Miller",
      book: "To Kill a Mockingbird",
      date: new Date(),
    },
    {
      name: "Sophia Davis",
      book: "The Great Gatsby",
      date: subDays(new Date(), 1),
    },
    {
      name: "Ethan Thompson",
      book: "1984",
      date: subDays(new Date(), 1),
    },
    {
      name: "Olivia Wilson",
      book: "Pride and Prejudice",
      date: subDays(new Date(), 2),
    },
    {
      name: "Liam Johnson",
      book: "The Catcher in the Rye",
      date: subDays(new Date(), 3),
    },
  ];
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("recent_borrows")}</CardTitle>
        <CardDescription>{t("recent_borrows_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentBorrows.map((borrow, index) => {
            return (
              <div key={index} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/placeholder.svg?height=36&width=36"
                    alt="Avatar"
                  />
                  <AvatarFallback>{borrow.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {borrow.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{borrow.book}</p>
                </div>
                <div className="ml-auto text-muted-foreground text-sm">
                  {getRelativeDayLabel(borrow.date)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function getRelativeDayLabel(date: Date): string {
  const today = new Date();
  const diff = differenceInCalendarDays(today, date);
  //const { t } = await getServerTranslations();

  switch (diff) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    case 2:
      return "2 days ago";
    case 3:
      return "3 days ago";
    default:
      return format(date, "MMMM d, yyyy");
  }
}
