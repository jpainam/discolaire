import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  BoxIcon,
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { getServerTranslations } from "~/i18n/server";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { BookTab } from "./BookTab";
import { LibraryDashboard } from "./LibraryDashboard";
import { LibrarySetting } from "./LibrarySetting";
import { BorrowBookDataTable } from "./loans/LoanDataTable";
import { LoanHeader } from "./loans/LoanHeader";
import { ReservationDataTable } from "./reservations/ReservationDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  const books = await caller.book.all();

  prefetch(trpc.library.borrowBooks.queryOptions({ limit: 2000 }));
  return (
    <HydrateClient>
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="text-foreground justify-start w-full mb-2 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
            <TabsTrigger
              value="tab-1"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <HouseIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("dashboard")}
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <PanelsTopLeftIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("materials")}
              <Badge
                className="bg-primary/15 ms-1.5 min-w-5 px-1"
                variant="secondary"
              >
                {books.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <BoxIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("loans")}
              <Badge className="ms-1.5">New</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="tab-4"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <UsersRoundIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("reservations")}
            </TabsTrigger>
            <TabsTrigger
              value="tab-5"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <ChartLine
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("insights")}
            </TabsTrigger>
            <TabsTrigger
              value="tab-6"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <SettingsIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {t("settings")}
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1">
          <LibraryDashboard />
        </TabsContent>
        <TabsContent value="tab-2">
          <BookTab />
        </TabsContent>
        <TabsContent value="tab-3">
          <div className="flex flex-col gap-2">
            <LoanHeader />
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 px-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 " />
                  ))}
                </div>
              }
            >
              <BorrowBookDataTable />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="tab-4">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 px-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 " />
                  ))}
                </div>
              }
            >
              <ReservationDataTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="tab-5">
          <p className="text-muted-foreground pt-1 text-center text-xs">
            Encours d'implementation
          </p>
        </TabsContent>
        <TabsContent value="tab-6">
          <LibrarySetting />
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
