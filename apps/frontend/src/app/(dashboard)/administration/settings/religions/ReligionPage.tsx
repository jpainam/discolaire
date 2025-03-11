import { getServerTranslations } from "~/i18n/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ReligionAction } from "./ReligionAction";
import { ReligionTable } from "./ReligionTable";
export async function ReligionPage() {
  const { t } = await getServerTranslations();

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="border-b px-0 bg-muted/50 p-2">
        <CardTitle className="flex flex-row items-center justify-between ">
          {t("religions")}
          <ReligionAction />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ReligionTable />
      </CardContent>
    </Card>
  );
}
