import { Card, CardContent, CardHeader } from "@repo/ui/components/card";

import { ContactDetails } from "~/components/contacts/ContactDetails";
import { ContactDetailsHeader } from "~/components/contacts/ContactDetailsHeader";
import { ContactStudentTable } from "~/components/contacts/ContactStudentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  return (
    <div className="grid gap-4 py-2 px-4 xl:grid-cols-[40%_60%]">
      <Card className="p-0">
        <CardHeader className="border-b bg-muted/50 p-2">
          <ContactDetailsHeader contactId={id} />
        </CardHeader>
        <CardContent className="p-4 text-sm">
          <ContactDetails contactId={id} />
        </CardContent>
      </Card>
      <ContactStudentTable id={id} />
    </div>
  );
}
