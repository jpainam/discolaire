import { ContactHeader } from "~/components/contacts/ContactHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 flex-col">
      <ContactHeader />
      {children}
    </div>
  );
}
