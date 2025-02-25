import UserNavigation from "~/components/administration/users/user-navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <UserNavigation />
      {children}
    </div>
  );
}
