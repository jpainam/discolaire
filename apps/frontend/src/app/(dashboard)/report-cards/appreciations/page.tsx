import { Separator } from "~/components/ui/separator";

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
      <Separator />
      {/* {reports ? (
        <AppreciationTable reports={reports} />
      ) : (
        <EmptyState className="p-4" />
      )} */}
    </div>
  );
}
