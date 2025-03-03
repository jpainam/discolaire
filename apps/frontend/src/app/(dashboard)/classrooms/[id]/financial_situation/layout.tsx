import { FinanceHeader } from "~/components/classrooms/finances/FinanceHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full gap-2 flex-col">
      <FinanceHeader />
      {children}
    </div>
  );
}
