import { ContactHeader } from "@/components/contacts/ContactHeader";
import { Separator } from "@repo/ui/separator";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <ContactHeader />
      <Separator />
      {children}
    </div>
  );
}
