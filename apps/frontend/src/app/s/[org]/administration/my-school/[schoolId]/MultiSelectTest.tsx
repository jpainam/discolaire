// "use client";

// import React from "react";

// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from "@repo/ui/components/avatar";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@repo/ui/components/card";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@repo/ui/components/tooltip";

// import { MultiSelectCombobox } from "./multi-selector";

// // Sample data
// const users = [
//   { value: "1", label: "John Doe", avatar: "/avatars/john.jpg" },
//   { value: "2", label: "Jane Smith", avatar: "/avatars/jane.jpg" },
//   { value: "3", label: "Bob Johnson", avatar: "/avatars/bob.jpg" },
// ];

// const technologies = [
//   { value: "react", label: "React", icon: "⚛️", description: "UI Library" },
//   {
//     value: "vue",
//     label: "Vue",
//     icon: "💚",
//     description: "Progressive Framework",
//   },
//   {
//     value: "angular",
//     label: "Angular",
//     icon: "🅰️",
//     description: "Full Framework",
//   },
// ];

// const priorities = [
//   { value: "low", label: "Low Priority" },
//   { value: "medium", label: "Medium Priority" },
//   { value: "high", label: "High Priority" },
// ];

// export function UserSelectDemo() {
//   const [selected, setSelected] = React.useState<string[]>([]);

//   const renderUser = (option: (typeof users)[0]) => (
//     <div className="flex items-center gap-2">
//       <Avatar className="h-6 w-6">
//         <AvatarImage src={option.avatar} />
//         <AvatarFallback>{option.label[0]}</AvatarFallback>
//       </Avatar>
//       {option.label}
//     </div>
//   );

//   const renderSelected = (value: string[]) => (
//     <div className="flex -space-x-2">
//       {value.map((id) => {
//         const user = users.find((u) => u.value === id)!;
//         return (
//           <Avatar key={id} className="border-background h-6 w-6 border-2">
//             <AvatarImage src={user.avatar} />
//             <AvatarFallback>{user.label[0]}</AvatarFallback>
//           </Avatar>
//         );
//       })}
//     </div>
//   );

//   return (
//     <Card className="border-input w-[400px]">
//       <CardHeader>
//         <CardTitle>User Select</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <MultiSelectCombobox
//           label="Users"
//           options={users}
//           value={selected}
//           onChange={setSelected}
//           renderItem={renderUser}
//           renderSelectedItem={renderSelected}
//         />
//       </CardContent>
//     </Card>
//   );
// }

// export function TechnologySelectDemo() {
//   const [selected, setSelected] = React.useState<string[]>([]);

//   const renderTech = (option: (typeof technologies)[0]) => (
//     <div className="flex items-center gap-2">
//       <span className="text-xl">{option.icon}</span>
//       <div className="flex flex-col">
//         <span>{option.label}</span>
//         <span className="text-muted-foreground text-xs">
//           {option.description}
//         </span>
//       </div>
//     </div>
//   );

//   const renderSelected = (value: string[]) => (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger>
//           <div className="flex gap-1">
//             {value.map((id) => {
//               const tech = technologies.find((t) => t.value === id)!;
//               return <span key={id}>{tech.icon}</span>;
//             })}
//           </div>
//         </TooltipTrigger>
//         <TooltipContent>
//           {value.map((id) => {
//             const tech = technologies.find((t) => t.value === id)!;
//             return <div key={id}>{tech.label}</div>;
//           })}
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );

//   return (
//     <Card className="border-input w-[400px]">
//       <CardHeader>
//         <CardTitle>Technology Select</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <MultiSelectCombobox
//           label="Technologies"
//           options={technologies}
//           value={selected}
//           onChange={setSelected}
//           renderItem={renderTech}
//           renderSelectedItem={renderSelected}
//         />
//       </CardContent>
//     </Card>
//   );
// }

// export function PrioritySelectDemo() {
//   const [selected, setSelected] = React.useState<string[]>([]);

//   const renderSelected = (value: string[]) => {
//     if (value.length === 0) return "";
//     if (value.length === 1) {
//       return priorities.find((p) => p.value === value[0])?.label;
//     }
//     return `${value.length} priorities selected`;
//   };

//   return (
//     <Card className="border-input w-[400px]">
//       <CardHeader>
//         <CardTitle>Priority Select</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <MultiSelectCombobox
//           label="Priority"
//           options={priorities}
//           value={selected}
//           onChange={setSelected}
//           renderItem={(option) => option.label}
//           renderSelectedItem={renderSelected}
//         />
//       </CardContent>
//     </Card>
//   );
// }
