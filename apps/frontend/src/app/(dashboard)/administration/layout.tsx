import { AdminSidebar } from "@/components/administration/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <AdminSidebar className="w-[250px]" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
