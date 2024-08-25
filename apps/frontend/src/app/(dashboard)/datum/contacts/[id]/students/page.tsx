import StudentContactList from "~/components/contacts/StudentContactList";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="text-md grid w-full items-start gap-2 rounded-md border border-t-8 p-2 md:grid-cols-2">
      <StudentContactList contactId={id} />
    </div>
  );
}
