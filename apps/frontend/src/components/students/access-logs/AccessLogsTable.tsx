import type { RouterOutputs } from "@repo/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  Clock4,
  LogInIcon,
  LogOutIcon,
  MapPinIcon,
  MonitorSmartphoneIcon,
  User,
  Users,
} from "lucide-react";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export async function AccessLogsTable({
  studentId,
  userId,
}: {
  studentId: string;
  userId: string;
}) {
  const { t } = await getServerTranslations();

  const studentLogs = await caller.user.loginActivities({
    userIds: [userId],
  });

  const studentContacts = await caller.student.contacts(studentId);
  const contactLogs = await caller.user.loginActivities({
    userIds: studentContacts
      .map((c) => c.contact.userId)
      .filter((e) => e !== null),
  });

  return (
    <div className="px-4">
      <Tabs defaultValue="student">
        <TabsList>
          <TabsTrigger value="student">
            <User className="h-4 w-4" />
            {t("student")}
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4" />
            {t("contacts")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <UserActivityTable userActivities={studentLogs} />
        </TabsContent>
        <TabsContent value="contacts">
          <UserActivityTable userActivities={contactLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const calculateDuration = (login: Date, logout: Date) => {
  const loginTime = login.getTime();
  const logoutTime = logout.getTime();
  const durationMs = logoutTime - loginTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

async function UserActivityTable({
  userActivities,
}: {
  userActivities: RouterOutputs["user"]["loginActivities"];
}) {
  const { i18n, t } = await getServerTranslations();
  const format = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <div className="flex gap-2 flex-row items-center">
                  <LogInIcon className="h-4 w-4" />
                  {t("login_date")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-row gap-2 items-center">
                  <LogOutIcon className="h-4 w-4" />
                  {t("logout_date")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex gap-2 flex-row items-center">
                  <MapPinIcon className="h-4 w-4" />
                  {t("ip_address")}
                </div>
              </TableHead>
              <TableHead className="w-1/3">
                <div className="flex flex-row gap-2 items-center">
                  <MonitorSmartphoneIcon className="h-4 w-4" />
                  {t("device")}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex gap-2 flex-row items-center">
                  <Clock4 className="h-4 w-4" />
                  {t("duration")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userActivities.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <EmptyState className="py-8" title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
            {userActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="py-0 font-medium">
                  {format.format(activity.loginDate)}
                </TableCell>
                <TableCell className="py-0">
                  {activity.logoutDate && format.format(activity.logoutDate)}
                </TableCell>
                <TableCell className="py-0">{activity.ipAddress}</TableCell>
                <TableCell className="py-0 ">
                  <div className="truncate w-1/3">{activity.userAgent}</div>
                </TableCell>
                <TableCell className="py-0 text-right">
                  {activity.logoutDate &&
                    calculateDuration(activity.loginDate, activity.logoutDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
