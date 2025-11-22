import { EmptyComponent } from "~/components/EmptyComponent";
import { MailLayout } from "~/components/users/emails/MailLayout";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  if (!student.userId) {
    return <EmptyComponent title="Create a user first" />;
  }
  return <MailLayout userId={student.userId} />;
}
