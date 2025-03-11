import { getServerTranslations } from "~/i18n/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { StaffLevelAction } from "./StaffLevelAction";
import { StaffLevelTable } from "./StaffLevelTable";
export async function StaffLevelPage() {
  const { t } = await getServerTranslations();

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="border-b px-0 bg-muted/50 p-2">
        <CardTitle className="flex flex-row items-center justify-between ">
          {t("staff_level")}
          <StaffLevelAction />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <StaffLevelTable />
      </CardContent>
    </Card>
  );
}
