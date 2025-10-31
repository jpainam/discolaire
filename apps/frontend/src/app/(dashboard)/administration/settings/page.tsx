import { StudentContactRelationship } from "~/components/administration/settings/StudentContactRelationship";
import { ClubTable } from "./clubs/ClubTable";
import { ReligionTable } from "./religions/ReligionTable";
import { SportTable } from "./sports/SportTable";
import { StaffLevelTable } from "./staff-levels/StaffLevelTable";

export default function Page() {
  return (
    <div className="grid gap-4 p-4 lg:grid-cols-3">
      <StudentContactRelationship />
      <div className="flex flex-col gap-4">
        <ClubTable />
        <SportTable />
        <ReligionTable />
      </div>
      <StaffLevelTable />
    </div>
  );
}
