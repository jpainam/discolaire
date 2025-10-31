import StudentContactList from "~/components/contacts/StudentContactList";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  return (
    <div className="text-md grid w-full items-start gap-2 md:grid-cols-2">
      <StudentContactList contactId={id} />
    </div>
  );
}
