export default function Page({
  params: { subjectJournalId },
}: {
  params: { subjectJournalId: string };
}) {
  return <div>{subjectJournalId}</div>;
}
