import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { FundDataTable } from "./FundDataTable";
import { FundHeader } from "./FundHeader";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <FundHeader />
      <Separator />
      <div className="w-full px-4">
        <Tabs defaultValue="account" className="">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="chart">Courbe</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="">
            <FundDataTable />
          </TabsContent>
          <TabsContent value="chart"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
