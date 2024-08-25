"use client";
import { useSearchParams } from "next/navigation";

//import { getColumns } from "../../../app/(dashboard)/task/columns";
//import { DataTable } from "../data-table";
import { EmptyState } from "@/components/EmptyState";
import { useLocale } from "@/hooks/use-locale";
import { StudentResults } from "./students/student-results";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const target = searchParams.get("target");

  if (target === "students") {
    return <StudentResults />;
  }
  return (
    <div className="flex items-center">
      <EmptyState
        title={t("no_search_criteria")}
        description={t("no_search_criteria_description")}
        className="h-[200px] w-[200px]"
      />
    </div>
  );
}
