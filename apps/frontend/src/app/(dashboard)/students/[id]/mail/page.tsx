import { EmptyState } from "~/components/EmptyState";
import { MailLayout } from "~/components/users/emails/MailLayout";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  if (!student.userId) {
    return <EmptyState title="Create a user first" className="my-8" />;
  }
  return <MailLayout userId={student.userId} />;
}
