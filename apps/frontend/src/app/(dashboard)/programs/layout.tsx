import Sidebar from "~/components/programs/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-grow pt-[100px]">
      <Sidebar className="w-[250px]" />
      {children}
    </div>
  );
}
