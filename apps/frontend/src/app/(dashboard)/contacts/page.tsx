import type { RouterOutputs } from "@repo/api";
import { auth } from "@repo/auth";
import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await auth();
  let contacts:
    | RouterOutputs["contact"]["lastAccessed"]
    | RouterOutputs["contact"]["all"];
  if (session?.user.profile != "staff") {
    contacts = await api.contact.all();
  } else {
    contacts = await api.contact.lastAccessed({
      limit: 50,
    });
  }
  return (
    <div className="px-4">
      <ContactDataTable contacts={contacts} />
    </div>
  );
}
