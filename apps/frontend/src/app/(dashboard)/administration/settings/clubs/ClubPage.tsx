import { getServerTranslations } from "~/i18n/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ClubAction } from "./ClubAction";
import { ClubTable } from "./ClubTable";
export async function ClubPage() {
  const { t } = await getServerTranslations();

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="border-b px-0 bg-muted/50 p-2">
        <CardTitle className="flex flex-row items-center justify-between ">
          {t("clubs")}
          <ClubAction />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ClubTable />
      </CardContent>
    </Card>
  );
}
