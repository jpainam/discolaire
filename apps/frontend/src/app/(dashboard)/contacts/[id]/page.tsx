import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { notFound } from "next/navigation";

import { ContactDetails } from "~/components/contacts/ContactDetails";
import { ContactDetailsHeader } from "~/components/contacts/ContactDetailsHeader";
import { ContactStudentTable } from "~/components/contacts/ContactStudentTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const contact = await api.contact.get(id);
  if (!contact) {
    notFound();
  }

  const studentContacts = await api.contact.students(id);

  return (
    <div className="grid gap-4 py-2 px-4 xl:grid-cols-[40%_58%]">
      <Card className="p-0">
        <CardHeader className="border-b bg-muted/50 p-2">
          <ContactDetailsHeader contact={contact} />
        </CardHeader>
        <CardContent className="p-4 text-sm">
          <ContactDetails contactId={id} />
        </CardContent>
      </Card>
      <ContactStudentTable studentContacts={studentContacts} />
    </div>
  );
}
