import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";
import { CommunicationLog } from "./communication-log";
import { ConnectedStudents } from "./connected-students";
import { ContactInfo } from "./contact-info";
import { DocumentsCard } from "./documents-card";
import { EventsHistory } from "./events-history";
import { FinancialSummary } from "./financial-summary";
import { NotesCard } from "./notes-card";
import { NotificationPreferences } from "./notification-preferences";
import { parentData } from "./parent-data";
import { PersonalInfo } from "./personal-info";
import { QuickActions } from "./quick-actions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = params.id;
  const queryClient = getQueryClient();
  const contact = await queryClient.fetchQuery(
    trpc.contact.get.queryOptions(contactId),
  );
  const t = await getTranslations();
  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("contacts"), href: "/contacts" },
          { label: getFullName(contact) },
        ]}
      />
      <div className="py-2">
        {/* Tabbed Content for Mobile */}
        <div className="mt-6 lg:hidden">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <PersonalInfo contact={contact} />
              <ContactInfo contact={contact} parent={parentData} />
              <QuickActions />
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <ConnectedStudents contactId={contactId} />
              <NotificationPreferences
                preferences={parentData.notificationPreferences}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <CommunicationLog communications={parentData.communicationLog} />
              <EventsHistory events={parentData.events} />
            </TabsContent>

            <TabsContent value="more" className="space-y-4">
              <DocumentsCard documents={parentData.documents} />
              <FinancialSummary parent={parentData} />
              <NotesCard notes={parentData.notes} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Grid Layout for Desktop */}
        <div className="hidden grid-cols-12 gap-2 px-4 lg:grid">
          {/* Left Column - Personal & Contact Info */}
          <div className="col-span-3 space-y-4">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <PersonalInfo contact={contact} />
            </ErrorBoundary>
            <ErrorBoundary errorComponent={ErrorFallback}>
              <ContactInfo contact={contact} parent={parentData} />
            </ErrorBoundary>
          </div>

          {/* Middle Column - Students, Communications, Events */}
          <div className="col-span-6 space-y-6">
            <ConnectedStudents contactId={contactId} />
            <div className="grid grid-cols-2 gap-6">
              <CommunicationLog communications={parentData.communicationLog} />
              <EventsHistory events={parentData.events} />
            </div>
            <DocumentsCard documents={parentData.documents} />
          </div>

          {/* Right Column - Notifications, Financial, Quick Actions */}
          <div className="col-span-3 space-y-6">
            <QuickActions />
            <NotificationPreferences
              preferences={parentData.notificationPreferences}
            />
            <FinancialSummary parent={parentData} />
            <NotesCard notes={parentData.notes} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
