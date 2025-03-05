import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const contacts = await api.contact.lastAccessed({});
  return (
    <div className="flex w-full flex-row px-4">
      <ContactDataTable contacts={contacts} />
      {/* <div className="grid md:grid-cols-2 p-1 gap-2">
        <ContactEffectif />
        <ContactGenderEffectif />
        <ContactEffectif />
        <ContactEffectif />
      </div> */}
    </div>
  );
}
