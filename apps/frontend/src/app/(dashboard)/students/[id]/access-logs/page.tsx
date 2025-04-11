import { AccessLogsTable } from "~/components/students/access-logs/AccessLogsTable";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  const studentLogs = student.userId
    ? await caller.user.loginActivities({ userIds: [student.userId] })
    : [];

  const studentContacts = await caller.student.contacts(params.id);
  const contactLogs = await caller.user.loginActivities({
    userIds: studentContacts
      .map((c) => c.contact.userId)
      .filter((e) => e !== null),
  });
  return (
    <AccessLogsTable studentLogs={studentLogs} contactLogs={contactLogs} />
  );
}
