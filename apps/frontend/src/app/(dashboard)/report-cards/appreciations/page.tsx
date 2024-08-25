import { EmptyState } from "@/components/EmptyState";
import { AppreciationHeader } from "@/components/report-cards/appreciations/AppreciationHeader";
import { AppreciationTable } from "@/components/report-cards/appreciations/AppreciationTable";
import { reportCardService } from "@/server/services/report-card-service";
import { Separator } from "@repo/ui/separator";

type AppreciationProps = {
  searchParams: {
    type: "subjects" | "students";
    classroom: string;
    term: number;
  };
};
export default async function Page({ searchParams }: AppreciationProps) {
  const reports =
    searchParams.classroom &&
    searchParams.term &&
    (await reportCardService.getStudentSummary(
      searchParams.classroom,
      searchParams.term,
    ));
  return (
    <div className="flex flex-col">
      <AppreciationHeader />
      <Separator />
      {reports ? (
        <AppreciationTable reports={reports} />
      ) : (
        <EmptyState className="p-4" />
      )}
    </div>
  );
}
