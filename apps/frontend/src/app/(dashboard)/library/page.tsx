import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  BoxIcon,
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { BookTab } from "./BookTab";
import { LibraryDashboard } from "./LibraryDashboard";
import { LibrarySetting } from "./LibrarySetting";
import { BorrowBookDataTable } from "./loans/LoanDataTable";
import { LoanHeader } from "./loans/LoanHeader";
import { ReservationDataTable } from "./reservations/ReservationDataTable";

export default async function Page() {
  const t = await getTranslations();
  const bookCount = await caller.book.count();

  prefetch(trpc.book.recentlyUsed.queryOptions());
  return (
    <HydrateClient>
      <Tabs defaultValue="tab-1" className="px-4 py-2">
        <TabsList>
          <TabsTrigger value="tab-1">
            <HouseIcon size={16} aria-hidden="true" />
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger value="tab-2">
            <PanelsTopLeftIcon size={16} aria-hidden="true" />
            {t("materials")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1"
              variant="secondary"
            >
              {bookCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-3">
            <BoxIcon size={16} aria-hidden="true" />
            {t("loans")}
            <Badge className="ms-1.5">New</Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-4">
            <UsersRoundIcon size={16} aria-hidden="true" />
            {t("reservations")}
          </TabsTrigger>
          <TabsTrigger value="tab-5">
            <ChartLine size={16} aria-hidden="true" />
            {t("insights")}
          </TabsTrigger>
          <TabsTrigger value="tab-6">
            <SettingsIcon size={16} aria-hidden="true" />
            {t("settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tab-1">
          <LibraryDashboard />
        </TabsContent>
        <TabsContent value="tab-2">
          <BookTab />
        </TabsContent>
        <TabsContent value="tab-3">
          <div className="flex flex-col gap-2">
            <LoanHeader />
            <BorrowBookDataTable />
          </div>
        </TabsContent>
        <TabsContent value="tab-4">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <ReservationDataTable />
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
