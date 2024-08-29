import { Separator } from "@repo/ui/separator";

import { ContactHeader } from "~/components/contacts/ContactHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <ContactHeader />
      <Separator />
      {children}
    </div>
  );
}
