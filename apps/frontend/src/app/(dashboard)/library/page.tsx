import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
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
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { BookTab } from "./BookTab";
import { LibraryDashboard } from "./LibraryDashboard";
import { LibrarySetting } from "./LibrarySetting";
import { BorrowBookDataTable } from "./loans/LoanDataTable";
import { LoanHeader } from "./loans/LoanHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  const books = await api.book.all();
  const borrowBooks = await api.library.borrowBooks({ limit: 2000 });
  return (
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
          <BorrowBookDataTable books={borrowBooks} />
        </div>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Encours d'implementation
        </p>
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
  );
}
