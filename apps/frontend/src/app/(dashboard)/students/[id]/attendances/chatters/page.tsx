import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ termId?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const studentId = params.id;
  const termId = searchParams.termId
    ? parseInt(searchParams.termId)
    : undefined;
  const chatters = await caller.chatter.byStudent({
    studentId: studentId,
    termId: termId,
  });
  return <div>{JSON.stringify(chatters)}</div>;
}
