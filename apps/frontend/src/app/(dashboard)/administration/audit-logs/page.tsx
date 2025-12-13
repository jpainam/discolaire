// "use client";

// import { format } from "date-fns";
// import { Download, Search, User } from "lucide-react";
// import { useState } from "react";

// import type { RouterOutputs } from "@repo/api";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "~/components/ui/accordion";
// import { Badge } from "~/components/ui/badge";
// import { Button } from "~/components/ui/button";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "~/components/ui/card";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
// } from "~/components/ui/pagination";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "~/components/ui/sheet";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "~/components/ui/table";
// import { useQuery } from "@tanstack/react-query";
// import { parseAsIsoDate, useQueryState } from "nuqs";
// import { useDebouncedCallback } from "use-debounce";
// import { DatePicker } from "~/components/DatePicker";
// import FlatBadge from "~/components/FlatBadge";
// import { useTranslations } from "next-intl";
// import { useTRPC } from "~/trpc/react";

// export default function Page() {
//   const [date, setDate] = useQueryState("date", parseAsIsoDate);

//   const handleSearch = useDebouncedCallback((value: string) => {
//     void setSearchQuery(value);
//   }, 500);

//   const [searchQuery, setSearchQuery] = useQueryState("query", {
//     defaultValue: "",
//   });
//   const [eventTypeFilter, setEventTypeFilter] = useQueryState("eventType", {
//     defaultValue: "",
//   });
//   const [sourceFilter, setSourceFilter] = useQueryState("source", {
//     defaultValue: "",
//   });
//   const [selectedLog, setSelectedLog] = useState<
//     RouterOutputs["logActivity"]["search"][number] | null
//   >(null);

//   const trpc = useTRPC();
//   const auditLogQuery = useQuery(
//     trpc.logActivity.search.queryOptions({
//       query: searchQuery,
//       eventType: eventTypeFilter
//         ? (eventTypeFilter as
//             | "CREATE"
//             | "UPDATE"
//             | "DELETE"
//             | "READ"
//             | undefined)
//         : undefined,
//       source: sourceFilter,
//       from: date ?? undefined,
//     }),
//   );

//   const auditLogs = auditLogQuery.data ?? [];

//   // Get unique sources for filter dropdown
//   const sources = Array.from(new Set(auditLogs.map((log) => log.source)));

//   // Get event type badge color
//   const getEventTypeBadge = (eventType: string) => {
//     switch (eventType.toLowerCase()) {
//       case "create":
//         return <FlatBadge variant={"green"}>Create</FlatBadge>;
//       case "update":
//         return <FlatBadge variant={"blue"}>Update</FlatBadge>;
//       case "delete":
//         return <FlatBadge variant={"red"}>Delete</FlatBadge>;
//       default:
//         return <Badge>{eventType}</Badge>;
//     }
//   };
//
//   return (
//     <div className="">
//       <Card className="shadow-none rounded-none border-none">
//         <CardHeader>
//           <CardTitle>{t("audit_logs")}</CardTitle>
//           <CardDescription>
//             View all system activity and changes made by users
//           </CardDescription>
//           <CardAction>
//             <Button variant="outline">
//               <Download className="h-4 w-4" />
//               Export Logs
//             </Button>
//           </CardAction>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-4">
//             <div className="space-y-2">
//               <Label>Search</Label>
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder={t("search")}
//                   className="pl-8"
//                   value={searchQuery}
//                   onChange={(e) => handleSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Date</Label>

//             </div>

//             <div className="space-y-2">
//               <Label>Event Type</Label>
//               <Select
//                 value={eventTypeFilter}
//                 onValueChange={(val) =>
//                   setEventTypeFilter(val === "all" ? "" : val)
//                 }
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="All event types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={"all"}>All event types</SelectItem>
//                   <SelectItem value="CREATE">Create</SelectItem>
//                   <SelectItem value="UPDATE">Update</SelectItem>
//                   <SelectItem value="DELETE">Delete</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Source</Label>
//               <Select
//                 value={sourceFilter}
//                 onValueChange={(val) =>
//                   setSourceFilter(val === "all" ? "" : val)
//                 }
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="All sources" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={"all"}>All sources</SelectItem>
//                   {sources.map((source) => (
//                     <SelectItem key={source} value={source}>
//                       {source}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="space-y-2 flex flex-col">
//         <Table className="font-mono text-xs">
//           <TableHeader>
//             <TableRow>
//               <TableHead>Timestamp</TableHead>
//               <TableHead>User</TableHead>
//               <TableHead>Source</TableHead>
//               <TableHead>Event Type</TableHead>
//               <TableHead>Event</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {auditLogs.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   No audit logs found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               auditLogs.map((log) => (
//                 <TableRow
//                   key={log.id}
//                   className="group cursor-pointer hover:bg-muted/50"
//                   onClick={() => setSelectedLog(log)}
//                 >
//                   <TableCell className="font-medium py-0">
//                     {format(log.createdAt, "MMM d, yyyy")}
//                     <div className="text-xs text-muted-foreground">
//                       {format(log.createdAt, "h:mm a")}
//                     </div>
//                   </TableCell>
//                   <TableCell className="py-0">
//                     <div className="flex items-center gap-2">
//                       <div className="rounded-full bg-muted p-1">
//                         <User className="h-4 w-4" />
//                       </div>
//                       <div>
//                         <div>{log.user.name}</div>
//                         <div className="text-xs text-muted-foreground">
//                           {log.user.profile}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="py-0">{log.source}</TableCell>
//                   <TableCell className="py-0">
//                     {getEventTypeBadge(log.eventType)}
//                   </TableCell>
//                   <TableCell className="py-0 truncate">{log.event}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//         <Pagination className="w-auto">
//           <PaginationContent className="gap-3">
//             <PaginationItem>
//               <Button
//                 variant="outline"
//                 size={"sm"}
//                 aria-label="Go to previous page"
//               >
//                 {t("previous")}
//               </Button>
//             </PaginationItem>
//             <PaginationItem>
//               <Button
//                 variant="outline"
//                 size={"sm"}
//                 aria-label="Go to next page"
//               >
//                 {t("next")}
//               </Button>
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>

//       {/* Details Sheet */}
//       <Sheet
//         open={!!selectedLog}
//         onOpenChange={(open) => !open && setSelectedLog(null)}
//       >
//         <SheetContent className="sm:max-w-md">
//           <SheetHeader>
//             <SheetTitle>Audit Log Details</SheetTitle>
//             <SheetDescription>
//               {selectedLog?.createdAt
//                 ? format(selectedLog.createdAt, "PPP 'at' h:mm a")
//                 : ""}
//             </SheetDescription>
//           </SheetHeader>

//           {selectedLog && (
//             <div className="mt-6 space-y-6 px-4">
//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   User
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <div className="rounded-full bg-muted p-2">
//                     <User className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <div className="font-medium">{selectedLog.user.name}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {selectedLog.user.profile} (ID: {selectedLog.userId})
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Event Information
//                 </h3>
//                 <div className="rounded-md border p-4">
//                   <div className="mb-2 flex items-center justify-between">
//                     <div className="font-medium">{selectedLog.source}</div>
//                     {getEventTypeBadge(selectedLog.eventType)}
//                   </div>
//                   <p>{selectedLog.event}</p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Details
//                 </h3>

//                 {selectedLog.eventType === "UPDATE" ? (
//                   <Accordion type="single" collapsible className="w-full">
//                     <AccordionItem value="changes">
//                       <AccordionTrigger>Changes</AccordionTrigger>
//                       <AccordionContent>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <h4 className="text-sm font-medium">
//                               Previous Value
//                             </h4>
//                             <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
//                               {JSON.stringify(
//                                 {
//                                   [selectedLog.data]: selectedLog.data,
//                                 },
//                                 null,
//                                 2,
//                               )}
//                             </pre>
//                           </div>
//                           <div className="space-y-2">
//                             <h4 className="text-sm font-medium">New Value</h4>
//                             <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
//                               {JSON.stringify(
//                                 {
//                                   [selectedLog.data]: selectedLog.data,
//                                 },
//                                 null,
//                                 2,
//                               )}
//                             </pre>
//                           </div>
//                         </div>
//                       </AccordionContent>
//                     </AccordionItem>
//                   </Accordion>
//                 ) : (
//                   <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
//                     {JSON.stringify(selectedLog.data, null, 2)}
//                   </pre>
//                 )}
//               </div>
//             </div>
//           )}
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
export default function Page() {
  return <div>Audit log en cours d'implementation</div>;
}
