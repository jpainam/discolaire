import { NotificationHeader } from "~/components/students/notifications/NotificationHeader";
import NotificationList from "~/components/students/notifications/NotificationList";

export default function Page() {
  //const t = await getTranslations();
  //const notifications = getStudentNotifications(id);
  return (
    <div className="flex flex-col gap-4">
      <NotificationHeader />
      <NotificationList />
    </div>
  );
}
