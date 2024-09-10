import { UserDataTable } from "~/components/administration/users/UserDataTable";

export default function Page() {
  return (
    <div className="flex flex-row justify-between">
      <UserDataTable />
    </div>
  );
}
