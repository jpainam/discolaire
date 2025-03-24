import { Separator } from "@repo/ui/components/separator";

import { AppreciationHeader } from "~/components/reportcards/appreciations/AppreciationHeader";

// interface AppreciationProps {
//   searchParams: {
//     type: "subjects" | "students";
//     classroom: string;
//     term: number;
//   };
// }
export default function Page() {
  return (
    <div className="flex flex-col">
      <AppreciationHeader />
      <Separator />
      {/* {reports ? (
        <AppreciationTable reports={reports} />
      ) : (
        <EmptyState className="p-4" />
      )} */}
    </div>
  );
}
