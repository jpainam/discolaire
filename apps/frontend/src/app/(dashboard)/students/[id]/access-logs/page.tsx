import { AccessLogsTable } from "~/components/students/access-logs/AccessLogsTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  const studentLogs = student.userId
    ? await api.user.loginActivities({ userIds: [student.userId] })
    : [];

  const studentContacts = await api.student.contacts(params.id);
  const contactLogs = await api.user.loginActivities({
    userIds: studentContacts
      .map((c) => c.contact.userId)
      .filter((e) => e !== null),
  });
  return (
    <AccessLogsTable studentLogs={studentLogs} contactLogs={contactLogs} />
  );
}
