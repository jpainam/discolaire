import { StudentContactRelationship } from "~/components/administration/settings/StudentContactRelationship";
import { ClubPage } from "./clubs/ClubPage";
import { ReligionPage } from "./religions/ReligionPage";
import { SportPage } from "./sports/SportPage";
import { StaffLevelPage } from "./staff-levels/StaffLevelPage";

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <StudentContactRelationship />
      <ClubPage />
      <SportPage />
      <ReligionPage />
      <StaffLevelPage />
    </div>
  );
}
