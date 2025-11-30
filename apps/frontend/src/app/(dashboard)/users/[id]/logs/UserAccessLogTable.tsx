// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@repo/ui/components/table";
// import {
//   Clock4,
//   LogInIcon,
//   LogOutIcon,
//   MapPinIcon,
//   MonitorSmartphoneIcon,
// } from "lucide-react";
// import { EmptyState } from "~/components/EmptyState";
// import { getServerTranslations } from "~/i18n/server";
// import { caller } from "~/trpc/server";

// export async function UserAccessLogTable({ userId }: { userId: string }) {
//   const studentLogs = await caller.loginActivity.all({
//     userId: userId,
//   });


//   const format = Intl.DateTimeFormat(i18n.language, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <div className="px-4">
//       <div className="bg-background overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/50">
//               <TableHead>
//                 <div className="flex gap-2 flex-row items-center">
//                   <LogInIcon className="h-4 w-4" />
//                   {t("login_date")}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex flex-row gap-2 items-center">
//                   <LogOutIcon className="h-4 w-4" />
//                   {t("logout_date")}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex gap-2 flex-row items-center">
//                   <MapPinIcon className="h-4 w-4" />
//                   {t("ip_address")}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div className="flex flex-row gap-2 items-center">
//                   <MonitorSmartphoneIcon className="h-4 w-4" />
//                   {t("device")}
//                 </div>
//               </TableHead>
//               <TableHead className="text-right">
//                 <div className="flex gap-2 flex-row items-center">
//                   <Clock4 className="h-4 w-4" />
//                   {t("duration")}
//                 </div>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {studentLogs.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center">
//                   <EmptyState className="py-8" title={t("no_data")} />
//                 </TableCell>
//               </TableRow>
//             )}
//             {studentLogs.map((activity) => (
//               <TableRow key={activity.id}>
//                 <TableCell className="py-0 font-medium">
//                   {format.format(activity.loginDate)}
//                 </TableCell>
//                 <TableCell className="py-0">
//                   {activity.logoutDate && format.format(activity.logoutDate)}
//                 </TableCell>
//                 <TableCell className="py-0">{activity.ipAddress}</TableCell>
//                 <TableCell className="py-0 ">
//                   <div className="truncate">{activity.userAgent}</div>
//                 </TableCell>
//                 <TableCell className="py-0 text-right">
//                   {activity.logoutDate &&
//                     calculateDuration(activity.loginDate, activity.logoutDate)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// const calculateDuration = (login: Date, logout: Date) => {
//   const loginTime = login.getTime();
//   const logoutTime = logout.getTime();
//   const durationMs = logoutTime - loginTime;
//   const hours = Math.floor(durationMs / (1000 * 60 * 60));
//   const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//   return `${hours}h ${minutes}m`;
// };
