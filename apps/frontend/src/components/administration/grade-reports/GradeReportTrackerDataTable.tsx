"use client";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { fetchGradeTrackerColumns } from "./GradeReportTrackerColumn";

export function GradeReportTrackerDataTable() {
  const trpc = useTRPC();
  const { data: gradeTracker } = useSuspenseQuery(
    trpc.gradeSheet.gradesReportTracker.queryOptions(),
  );

  const { t } = useLocale();
  const columns = useMemo(() => {
    return fetchGradeTrackerColumns({
      t: t,
    });
  }, [t]);

  const { table } = useDataTable({
    data: gradeTracker,
    columns: columns,
  });
  return <DataTable table={table} />;

  // return (
  //   <div className="grid gap-2">
  //     <div className="grid xl:grid-cols-2 gap-4 mb-4">
  //       <div className="grid gap-2">
  //         <Label>{t("classrooms")}</Label>
  //         <ClassroomSelector
  //           onChange={(val) => {
  //             console.log("Selected classroom:", val);
  //           }}
  //         />
  //       </div>
  //       <div className="grid gap-2">
  //         <Label>{t("terms")}</Label>
  //         <TermSelector
  //           onChange={(val) => {
  //             console.log("Selected term:", val);
  //           }}
  //         />
  //       </div>
  //     </div>

  //     <div className="mb-4 flex items-center gap-4">
  //       <div className="relative flex-1 max-w-sm">
  //         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  //         <Input
  //           placeholder="Search teachers..."
  //           value={searchTerm}
  //           onChange={(e) => handleSearchChange(e.target.value)}
  //           className="pl-10"
  //         />
  //       </div>
  //       <div className="text-sm text-muted-foreground">
  //         {filteredData.length} teacher
  //         {filteredData.length !== 1 ? "s" : ""} found
  //       </div>
  //     </div>

  //     <div className="border rounded-lg">
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>{t("Teacher")}</TableHead>
  //             <TableHead>{t("Progress")}</TableHead>
  //             <TableHead>{t("Completed")}</TableHead>
  //             <TableHead>{t("Remaining")}</TableHead>
  //             <TableHead>{t("Status")}</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {paginatedData.length === 0 ? (
  //             <TableRow>
  //               <TableCell
  //                 colSpan={5}
  //                 className="text-center py-8 text-muted-foreground"
  //               >
  //                 {searchTerm
  //                   ? `No teachers found matching "${searchTerm}"`
  //                   : "No teachers found"}
  //               </TableCell>
  //             </TableRow>
  //           ) : (
  //             paginatedData.map((data, index) => {
  //               const completed = data.terms.length;
  //               const remaining = 6 - data.terms.length;
  //               const progress = (completed / 6) * 100;

  //               return (
  //                 <TableRow
  //                   key={`${data.id}-${index}`}
  //                   className="cursor-pointer hover:bg-muted/50 transition-colors"
  //                   onClick={() => {
  //                     openSheet({
  //                       view: (
  //                         <GradeReportTracker subjectId={1} classroomId="" />
  //                       ),
  //                     });
  //                   }}
  //                 >
  //                   <TableCell className="font-medium">
  //                     <div className="flex items-center gap-2">
  //                       <User className="h-4 w-4" />
  //                       {getFullName(data.subject.teacher)}
  //                     </div>
  //                   </TableCell>
  //                   <TableCell>
  //                     <div className="flex items-center gap-2">
  //                       <Progress value={progress} className="w-20" />
  //                       <span className="text-sm text-muted-foreground">
  //                         {Math.round(progress)}%
  //                       </span>
  //                     </div>
  //                   </TableCell>
  //                   <TableCell>
  //                     <Badge variant="secondary">{completed}/6</Badge>
  //                   </TableCell>
  //                   <TableCell>
  //                     <Badge variant={remaining === 0 ? "default" : "outline"}>
  //                       {remaining}
  //                     </Badge>
  //                   </TableCell>
  //                   <TableCell>
  //                     {completed === 6 ? (
  //                       <Badge className="bg-green-500 hover:bg-green-600">
  //                         Complete
  //                       </Badge>
  //                     ) : completed > 0 ? (
  //                       <Badge variant="secondary">In Progress</Badge>
  //                     ) : (
  //                       <Badge variant="outline">Not Started</Badge>
  //                     )}
  //                   </TableCell>
  //                 </TableRow>
  //               );
  //             })
  //           )}
  //         </TableBody>
  //       </Table>
  //     </div>

  //     {/* Pagination Controls */}
  //     {totalPages > 1 && (
  //       <div className="flex items-center justify-between mt-4">
  //         <div className="text-sm text-muted-foreground">
  //           Showing {startIndex + 1} to{" "}
  //           {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
  //           {filteredData.length} teachers
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             onClick={() => goToPage(currentPage - 1)}
  //             disabled={currentPage === 1}
  //           >
  //             <ChevronLeft className="h-4 w-4" />
  //             Previous
  //           </Button>

  //           <div className="flex items-center gap-1">
  //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
  //               (page) => (
  //                 <Button
  //                   key={page}
  //                   variant={currentPage === page ? "default" : "outline"}
  //                   size="sm"
  //                   onClick={() => goToPage(page)}
  //                   className="w-8 h-8 p-0"
  //                 >
  //                   {page}
  //                 </Button>
  //               )
  //             )}
  //           </div>

  //           <Button
  //             variant="outline"
  //             size="sm"
  //             onClick={() => goToPage(currentPage + 1)}
  //             disabled={currentPage === totalPages}
  //           >
  //             Next
  //             <ChevronRight className="h-4 w-4" />
  //           </Button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}
