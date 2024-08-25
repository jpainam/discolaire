import { FinanceHeader } from "@/components/classrooms/finances/FinanceHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col">
      <FinanceHeader />
      {children}
    </div>
  );
}
