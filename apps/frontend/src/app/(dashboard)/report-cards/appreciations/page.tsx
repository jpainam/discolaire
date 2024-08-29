import { Separator } from "@repo/ui/separator";

import { AppreciationHeader } from "~/components/report-cards/appreciations/AppreciationHeader";

// interface AppreciationProps {
//   searchParams: {
//     type: "subjects" | "students";
//     classroom: string;
//     term: number;
//   };
// }
export default function Page() {
  // const reports =
  //   searchParams.classroom &&
  //   searchParams.term &&
  //   (await reportCardService.getStudentSummary(
  //     searchParams.classroom,
  //     searchParams.term,
  //   ));
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
