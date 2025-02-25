// "use client";

// import { useLocale } from "~/i18n";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/components/select";
// import { Skeleton } from "@repo/ui/components/skeleton";

// import { cn } from "~/lib/utils";
// import { api } from "~/trpc/react";

// interface FeeTypeSelectorProps {
//   className?: string;
//   onChange?: (value: string) => void;
// }
// export function FeeTypeSelector({ className, onChange }: FeeTypeSelectorProps) {
//   const { t } = useLocale();
//   const feeTypesQuery = api.fee.types.useQuery();
//   return (
//     <Select
//       onValueChange={(val) => {
//         onChange?.(val);
//       }}
//     >
//       <SelectTrigger className={cn("w-full", className)}>
//         <SelectValue placeholder={t("type")} />
//       </SelectTrigger>
//       <SelectContent>
//         {feeTypesQuery.isPending && (
//           <SelectItem
//             key={"loading-select-fee-type"}
//             value="_loading_select_fee"
//           >
//             <Skeleton className="h-8 w-full" />
//           </SelectItem>
//         )}
//         {feeTypesQuery.data?.map((feeType) => {
//           return (
//             <SelectItem key={feeType.id} value={feeType.id}>
//               {feeType.name}
//             </SelectItem>
//           );
//         })}
//       </SelectContent>
//     </Select>
//   );
// }
