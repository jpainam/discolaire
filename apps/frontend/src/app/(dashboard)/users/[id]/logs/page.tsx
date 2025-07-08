// import { Skeleton } from "@repo/ui/components/skeleton";
// import { Suspense } from "react";
// import { UserAccessLogTable } from "./UserAccessLogTable";
// import { UserAccessLogHeader } from "./UserAccessLogHeader";

// export default async function Page(props: { params: Promise<{ id: string }> }) {
//   const params = await props.params;

//   return (
//     <div className="flex flex-col gap-2">
//       <UserAccessLogHeader userId={params.id} />
//       <Suspense
//         fallback={
//           <div className="grid grid-cols-1 lg:grid-cols-4 px-4 gap-4">
//             {Array.from({ length: 16 }).map((_, i) => (
//               <Skeleton key={i} className="h-8 " />
//             ))}
//           </div>
//         }
//       >
//         <UserAccessLogTable userId={params.id} />
//       </Suspense>
//     </div>
//   );
// }

export default function Page() {
  return <div></div>;
}
