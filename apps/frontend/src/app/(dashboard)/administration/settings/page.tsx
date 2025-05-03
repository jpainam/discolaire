import { StudentContactRelationship } from "~/components/administration/settings/StudentContactRelationship";
import { ClubTable } from "./clubs/ClubTable";
import { ReligionTable } from "./religions/ReligionTable";
import { SportTable } from "./sports/SportTable";
import { StaffLevelTable } from "./staff-levels/StaffLevelTable";
import { TimetableCategoryTable } from "./timetable-categories/TimetableCategoryTable";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-3 gap-4 p-4">
      <StudentContactRelationship />
      <div className="flex flex-col gap-4">
        <ClubTable />
        <SportTable />
        <ReligionTable />
      </div>
      <StaffLevelTable />
      <TimetableCategoryTable />
    </div>
  );
}
