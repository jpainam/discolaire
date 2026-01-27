import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { CreateStaffAttendance } from "./CreateStaffAttendance";
import { StaffAttendanceTable } from "./StaffAttendanceTable";

export default async function Page() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("staffs"), href: "/staffs" },
          { label: t("attendances") },
        ]}
      />
      <CreateStaffAttendance />
      <StaffAttendanceTable />
    </div>
  );
}
