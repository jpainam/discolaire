import { api } from "~/trpc/server";
import { FormerSchoolHeader } from "./FormerSchoolHeader";
import { SchoolDataTable } from "./SchoolDataTable";

export default async function Page() {
  const formerSchools = await api.formerSchool.all();
  return (
    <div className="flex flex-col gap-4">
      <FormerSchoolHeader />
      <div className="px-4">
        <SchoolDataTable schools={formerSchools} />
      </div>
    </div>
  );
}
