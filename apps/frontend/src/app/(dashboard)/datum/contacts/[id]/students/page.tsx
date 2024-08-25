import StudentContactList from "@/components/contacts/StudentContactList";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full text-md grid md:grid-cols-2 items-start gap-2 border rounded-md border-t-8 p-2">
      <StudentContactList contactId={id} />
    </div>
  );
}
