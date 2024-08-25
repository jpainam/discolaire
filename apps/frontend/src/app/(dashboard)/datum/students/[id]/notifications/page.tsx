import { getServerTranslations } from "@repo/i18n/server";

import { NotificationHeader } from "~/components/students/notifications/NotificationHeader";
import NotificationList from "~/components/students/notifications/NotificationList";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  //const notifications = getStudentNotifications(id);
  return (
    <div className="flex flex-col gap-4">
      <NotificationHeader />
      <NotificationList />
    </div>
  );
}
