import { Siren, Terminal } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";

import { SMSHistoryDataTable } from "~/components/administration/sms-management/SMSHistoryDataTable";
import { SMSHistoryHeader } from "~/components/administration/sms-management/SMSHistoryHeader";

// const smsHistorySchema = z.object({
//   per_page: z.number().optional(),
//   page: z.number().optional(),
//   name: z.string().optional(),
// });
//type SMSHistoryType = z.infer<typeof smsHistorySchema>;
export default async function Page() {
  //const smsHistory = await getSMSHistory();
  const { t } = await getServerTranslations();
  //const d = new Date();
  const f = [];
  for (let i = 0; i < 10; i++) {
    f.push({
      id: i,
      message: "Hello, this is a test message",
      status: "sent",
      sentAt: new Date(),
      createdAt: new Date(),
    });
  }
  //const balance = 40;
  return (
    <Card>
      <CardHeader className="flex flex-col items-start border-b bg-muted/50 px-2 py-1">
        <div className="flex w-full flex-row items-start">
          <SMSHistoryHeader />
          <div className="ml-auto">
            <Button className="h-8" size={"sm"} variant={"outline"}>
              <Siren className="mr-1 h-4 w-4" />
              <span>{t("sms_management.check_balance")} </span>
            </Button>
          </div>
        </div>
        <Alert
          className="p-2"
          //variant={balance < 3000 ? "destructive" : "default"}
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t("sms_balance")}</AlertTitle>
          <AlertDescription>
            {t("you_have")} 100 {t("sms_left")}
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="p-2 text-sm">
        <SMSHistoryDataTable count={500} smsHistory={f} />
      </CardContent>
    </Card>
  );
}
