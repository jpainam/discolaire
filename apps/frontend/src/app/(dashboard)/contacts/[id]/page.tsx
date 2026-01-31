"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
import { ProfileHeader } from "./profile-header";
import { QuickActions } from "./quick-actions";

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader parent={parentData} />

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
              <PersonalInfo parent={parentData} />
              <ContactInfo parent={parentData} />
              <QuickActions />
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <ConnectedStudents students={parentData.students} />
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
        <div className="mt-6 hidden grid-cols-12 gap-6 lg:grid">
          {/* Left Column - Personal & Contact Info */}
          <div className="col-span-3 space-y-6">
            <PersonalInfo parent={parentData} />
            <ContactInfo parent={parentData} />
          </div>

          {/* Middle Column - Students, Communications, Events */}
          <div className="col-span-6 space-y-6">
            <ConnectedStudents students={parentData.students} />
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
    </div>
  );
}
