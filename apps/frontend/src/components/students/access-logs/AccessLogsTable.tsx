import {
  Clock4,
  LogInIcon,
  LogOutIcon,
  MapPinIcon,
  MonitorSmartphoneIcon,
  User,
  Users,
} from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { getServerTranslations } from "@repo/i18n/server";
import { DirectionAwareTabs } from "@repo/ui/direction-aware-tabs";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

type LoginActivityType = RouterOutputs["user"]["loginActivities"][number];
export async function AccessLogsTable({
  studentLogs,
  contactLogs,
}: {
  studentLogs: LoginActivityType[];
  contactLogs: LoginActivityType[];
}) {
  const { t } = await getServerTranslations();

  const tabs = [
    {
      id: 0,
      label: (
        <div className="flex flex-row items-center gap-1">
          <User className="h-4 w-4" />
          {t("student")}
        </div>
      ),
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50">
          <UserActivityTable userActivities={studentLogs} />
        </div>
      ),
    },
    {
      id: 1,
      label: (
        <div className="flex flex-row items-center gap-1">
          <Users className="h-4 w-4" />
          {t("contacts")}
        </div>
      ),
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50">
          <UserActivityTable userActivities={contactLogs} />
        </div>
      ),
    },
  ];

  return (
    <div className="m-1 items-start justify-start">
      <DirectionAwareTabs rounded="rounded-md" tabs={tabs} />
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
  userActivities: LoginActivityType[];
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
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>
            <div className="flex flex-row items-center">
              <LogInIcon className="mr-2 h-4 w-4" />
              {t("login_date")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex flex-row items-center">
              <LogOutIcon className="mr-2 h-4 w-4" />
              {t("logout_date")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex flex-row items-center">
              <MapPinIcon className="mr-2 h-4 w-4" />
              {t("ip_address")}
            </div>
          </TableHead>
          <TableHead>
            <div className="flex flex-row items-center">
              <MonitorSmartphoneIcon className="mr-2 h-4 w-4" />
              {t("device")}
            </div>
          </TableHead>
          <TableHead className="text-right">
            <div className="flex flex-row items-center">
              <Clock4 className="mr-2 h-4 w-4" />
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
            <TableCell className="py-0">{activity.device}</TableCell>
            <TableCell className="py-0 text-right">
              {activity.logoutDate &&
                calculateDuration(activity.loginDate, activity.logoutDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
