import { MailLayout } from "~/components/users/emails/MailLayout";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <MailLayout userId={params.id} />;
}
