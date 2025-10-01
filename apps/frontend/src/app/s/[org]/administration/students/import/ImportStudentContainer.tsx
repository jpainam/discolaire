import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { ImportStudentRegistrationNumber } from "./ImportStudentRegistrationNumber";

export function ImportStudentContainer() {
  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="w-full flex-row p-0"
    >
      <TabsList className="flex-col rounded-none border-l">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Importer les matricules
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Autres imports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-1" className="bg-red-500 p-0">
        <ImportStudentRegistrationNumber />
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground px-4 py-3 text-xs">
          En cours d'implementation...
        </p>
      </TabsContent>
    </Tabs>
  );
}
