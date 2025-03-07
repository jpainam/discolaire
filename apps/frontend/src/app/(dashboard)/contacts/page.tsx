import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const contacts = await api.contact.lastAccessed({
    limit: 50,
  });
  return (
    <div className="px-4">
      <ContactDataTable contacts={contacts} />
    </div>
  );
}
