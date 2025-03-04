"use client";
"use client";

import { useState } from "react";

import type { Student } from "@repo/db";
import { AsyncSelect } from "~/components/async-select";
import { useLocale } from "~/i18n";

import { AvatarState } from "~/components/AvatarState";
import { cn } from "~/lib/utils";
import { getFullName } from "~/utils/full-name";
import { searchStudent } from "../../../actions/student";

export function StudentSelector({
  onChange,
  placeholder,
  className,
}: {
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { t } = useLocale();

  return (
    <AsyncSelect<Student>
      //preload

      triggerClassName={cn("w-full text-sm 2xl:w-[450px]", className)}
      fetcher={(q) => {
        return searchStudent(q ?? "");
      }}
      renderOption={(student) => (
        <div className="flex w-full items-center gap-2">
          <AvatarState
            avatar={student.avatar}
            pos={student.lastName?.length ?? 0}
          />
          <div className="flex flex-col">
            <div className="font-normal">{getFullName(student)}</div>
            {/* <div className="text-xs text-muted-foreground">{user.role}</div> */}
          </div>
        </div>
      )}
      placeholder={placeholder ?? t("search_for_an_option")}
      getOptionValue={(student) => student.id}
      getDisplayValue={(student) => (
        <div className="leading-tight text-xs">{getFullName(student)}</div>
      )}
      notFound={
        <div className="py-6 text-center text-sm">{t("not_found")}</div>
      }
      label={t("student")}
      //placeholder={}
      value={selectedUser}
      onChange={(stud) => {
        onChange?.(stud);
        setSelectedUser(stud);
      }}
      width="450px"
    />
  );
}
// import * as React from "react";
// import { useEffect, useState } from "react";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { Check, ChevronsUpDown } from "lucide-react";

// import { useLocale } from "~/i18n";
// import { Button } from "@repo/ui/components/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@repo/ui/components/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
// import { Skeleton } from "@repo/ui/components/skeleton";

// import { AvatarState } from "~/components/AvatarState";
// import { cn } from "~/lib/utils";
// import { api } from "~/trpc/react";
// import { getFullName } from "~/utils/full-name";

// // https://github.com/oaarnikoivu/shadcn-virtualized-combobox
// interface Option {
//   value: string;
//   label: string;
//   avatar?: string;
// }

// interface VirtualizedCommandProps {
//   height: string;
//   options: Option[];
//   placeholder: string;
//   selectedOption: string;
//   onSelectOption?: (option: string) => void;
// }

// const VirtualizedCommand = ({
//   height,
//   options,
//   placeholder,
//   selectedOption,
//   onSelectOption,
// }: VirtualizedCommandProps) => {
//   const [filteredOptions, setFilteredOptions] =
//     React.useState<Option[]>(options);
//   const parentRef = React.useRef(null);
//   const { t } = useLocale();

//   const virtualizer = useVirtualizer({
//     count: filteredOptions.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 35,
//     overscan: 5,
//   });

//   const virtualOptions = virtualizer.getVirtualItems();

//   const handleSearch = (search: string) => {
//     setFilteredOptions(
//       options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase()),
//       ),
//     );
//   };

//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === "ArrowDown" || event.key === "ArrowUp") {
//       event.preventDefault();
//     }
//   };

//   return (
//     <Command shouldFilter={false} onKeyDown={handleKeyDown}>
//       <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
//       <CommandList>
//         <CommandEmpty>{t("not_found")}</CommandEmpty>
//         <CommandGroup
//           ref={parentRef}
//           style={{
//             height: height,
//             width: "100%",
//             overflow: "auto",
//           }}
//         >
//           <div
//             style={{
//               height: `${virtualizer.getTotalSize()}px`,
//               width: "100%",
//               position: "relative",
//             }}
//           >
//             {virtualOptions.map((virtualOption, _index) => {
//               //const avatar = randomAvatar();
//               const current = filteredOptions[virtualOption.index];
//               return (
//                 <CommandItem
//                   className="flex cursor-pointer items-center justify-between"
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: `${virtualOption.size}px`,
//                     transform: `translateY(${virtualOption.start}px)`,
//                   }}
//                   key={filteredOptions[virtualOption.index]?.value}
//                   value={filteredOptions[virtualOption.index]?.value}
//                   onSelect={onSelectOption}
//                 >
//                   <div className="flex flex-row items-center gap-2">
//                     <AvatarState
//                       pos={
//                         filteredOptions[virtualOption.index]?.label.length ?? 0
//                       }
//                       className="h-6 w-6"
//                       avatar={current?.avatar}
//                     />
//                     {filteredOptions[virtualOption.index]?.label}
//                   </div>
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       selectedOption ===
//                         filteredOptions[virtualOption.index]?.value
//                         ? "opacity-100"
//                         : "opacity-0",
//                     )}
//                   />
//                 </CommandItem>
//               );
//             })}
//           </div>
//         </CommandGroup>
//       </CommandList>
//     </Command>
//   );
// };

// interface StudentSelectorProps {
//   searchPlaceholder?: string;
//   placeholder?: string;
//   width?: string;
//   height?: string;
//   className?: string;
//   defaultValue?: string;
//   onChange?: (value: string | null | undefined) => void;
// }

// export function StudentSelector({
//   searchPlaceholder,
//   placeholder,
//   className,
//   height = "400px",
//   onChange,
//   defaultValue,
// }: StudentSelectorProps) {
//   const studentSelectorQuery = api.student.selector.useQuery();

//   const [open, setOpen] = useState<boolean>(false);
//   const [selectedOption, setSelectedOption] = useState<Option>({
//     label: "",
//     value: defaultValue ?? "",
//   });
//   const [options, setOptions] = React.useState<Option[]>([]);
//   const { t } = useLocale();

//   useEffect(() => {
//     if (studentSelectorQuery.data) {
//       if (defaultValue) {
//         const dValue = studentSelectorQuery.data.find(
//           (item) => item.id === defaultValue,
//         );
//         if (dValue)
//           setSelectedOption({ label: getFullName(dValue), value: dValue.id });
//       }
//       setOptions(
//         studentSelectorQuery.data.map((student) => ({
//           label: getFullName(student),
//           value: student.id,
//           avatar: student.avatar ?? undefined,
//         })),
//       );
//     }
//   }, [defaultValue, studentSelectorQuery.data]);

//   if (studentSelectorQuery.isPending) {
//     return <Skeleton className={cn("h-8 w-full", className)} />;
//   }
//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className={cn("w-full justify-between", className)}
//         >
//           {selectedOption.value
//             ? (options.find((option) => option.value === selectedOption.value)
//                 ?.label ??
//               placeholder ??
//               t("select_an_option"))
//             : (placeholder ?? t("select_an_option"))}

//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="p-0" >
//         <VirtualizedCommand
//           height={height}
//           options={options.map((option) => ({
//             value: option.value,
//             label: option.label,
//             avatar: option.avatar,
//           }))}
//           placeholder={
//             searchPlaceholder ? searchPlaceholder : t("search_for_an_option")
//           }
//           selectedOption={selectedOption.value}
//           onSelectOption={(currentValue) => {
//             onChange?.(
//               currentValue === selectedOption.value ? null : currentValue,
//             );
//             setSelectedOption({
//               value: currentValue === selectedOption.value ? "" : currentValue,
//               label: "",
//             });
//             setOpen(false);
//           }}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }
