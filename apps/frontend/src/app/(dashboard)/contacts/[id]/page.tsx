import { ContactDetails } from "~/components/contacts/ContactDetails";
import { ContactDetailsHeader } from "~/components/contacts/ContactDetailsHeader";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  batchPrefetch([
    trpc.contact.get.queryOptions(id),
    trpc.contact.students.queryOptions(id),
  ]);

  return (
    <HydrateClient>
      <div className="grid gap-4 px-4 py-2 xl:grid-cols-[40%_58%]">
        <Card className="p-0">
          <CardHeader className="bg-muted/50 border-b p-2">
            <ContactDetailsHeader />
          </CardHeader>
          <CardContent className="p-4 text-sm">
            <ContactDetails contactId={id} />
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
