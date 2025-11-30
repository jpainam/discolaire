import { Card, CardContent, CardHeader } from "@repo/ui/components/card";

import { SMSHistoryDataTable } from "~/components/administration/sms-management/SMSHistoryDataTable";
import { SMSHistoryHeader } from "~/components/administration/sms-management/SMSHistoryHeader";

// const smsHistorySchema = z.object({
//   per_page: z.number().optional(),
//   page: z.number().optional(),
//   name: z.string().optional(),
// });
//type SMSHistoryType = z.infer<typeof smsHistorySchema>;
export default function Page() {
  //const smsHistory = await getSMSHistory();
  //const t = await getTranslations();
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
      <CardHeader className="bg-muted/50 flex flex-col items-start border-b px-2 py-1">
        <div className="flex w-full flex-row items-start">
          <SMSHistoryHeader />
        </div>
      </CardHeader>
      <CardContent className="p-2 text-sm">
        <SMSHistoryDataTable count={500} smsHistory={f} />
      </CardContent>
    </Card>
  );
}
