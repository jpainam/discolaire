// "use client";

// import { useMemo } from "react";
// import { useParams } from "next/navigation";
// import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { isBefore } from "date-fns";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// import type { RouterOutputs } from "@repo/api";
// import { Button } from "~/components/ui/button";
// import { Checkbox } from "~/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";

// import { DatePicker } from "~/components/DatePicker";
// import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
// import { useModal } from "~/hooks/use-modal";
// import { useTranslations } from "next-intl";
// import { useTRPC } from "~/trpc/react";

// const createEditTimetable = z.object({
//   startTime: z.string().min(1),
//   startDate: z.coerce.date(),
//   endDate: z.coerce.date(),
//   endTime: z.string().min(1),
//   categoryId: z.string().min(1),
//   subjectId: z.string().min(1),
//   isRepeating: z.boolean().default(true),
// });
// export function CreateEditLesson({
//   lesson,
// }: {
//   lesson?: RouterOutputs["subjectTimetable"]["byClassroom"][number] | null;
// }) {
//   const params = useParams<{ id: string }>();

//   const formatTimeForInput = (date: Date) => {
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = Math.floor(date.getMinutes() / 15) * 15;
//     return `${hours}:${minutes.toString().padStart(2, "0")}`;
//   };

//   const form = useForm({
//     resolver: standardSchemaResolver(createEditTimetable),
//     defaultValues: {
//       startDate: lesson?.start ?? new Date(),
//       startTime: lesson ? formatTimeForInput(lesson.start) : "08:00",
//       categoryId: lesson?.categoryId ?? "",
//       endDate: lesson?.end ?? new Date(),
//       endTime: lesson ? formatTimeForInput(lesson.start) : "09:00",
//       subjectId: lesson?.subjectId ? `${lesson.subjectId}` : "",
//       isRepeating: lesson?.groupKey ? true : false,
//     },
//   });
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//

//   const { closeModal } = useModal();
//   const hours24 = useMemo(() => {
//     const t = [];
//     for (let h = 7; h < 24; h++) {
//       for (let m = 0; m < 60; m += 30) {
//         const hour = h.toString().padStart(2, "0");
//         const minute = m.toString().padStart(2, "0");
//         t.push(`${hour}:${minute}`);
//       }
//     }
//     return t;
//   }, []);

//   // eslint-disable-next-line react-hooks/incompatible-library
//   const watchStartTime = form.watch("startTime");

//   const filteredEndTimes = useMemo(() => {
//     if (!watchStartTime) return hours24; // if no start time selected, show all
//     const startIndex = hours24.indexOf(watchStartTime);
//     return hours24.slice(startIndex + 1); // exclude startTime and earlier
//   }, [watchStartTime, hours24]);

//   const createLessonMutation = useMutation(
//     trpc.subjectTimetable.create.mutationOptions({
//       onSuccess: async () => {
//         await queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter());
//         toast.success(t("created_successfully"), { id: 0 });
//         closeModal();
//       },
//       onError: (error) => {
//         toast.error(error.message, { id: 0 });
//       },
//     }),
//   );

//   const handleSubmit = (data: z.infer<typeof createEditTimetable>) => {
//     if (!data.subjectId) {
//       toast.error(t("subject_required"), { id: 0 });
//       return;
//     }
//     const start = data.startDate;
//     const end = data.endDate;
//     const [startHours = 0, startMinutes = 0] = data.startTime
//       .split(":")
//       .map(Number);
//     const [endHours = 0, endMinutes = 0] = data.endTime.split(":").map(Number);

//     start.setHours(startHours, startMinutes, 0);
//     end.setHours(endHours, endMinutes, 0);
//     if (isBefore(end, start)) {
//       toast.error("End date cannot be before start date");
//       return;
//     }

//     const values = {
//       start: start,
//       end: end,
//       subjectId: Number(data.subjectId),
//       isRepeating: data.isRepeating,
//       categoryId: data.categoryId,
//       startDate: start,
//     };
//     if (lesson) {
//       toast.loading(t("updating"), { id: 0 });
//       console.log("updating");
//     } else {
//       toast.loading(t("creating"), { id: 0 });
//       createLessonMutation.mutate(values);
//     }
//   };
//   return (
//     <Form {...form}>
//       <form
//         className="flex flex-col gap-4"
//         onSubmit={form.handleSubmit(handleSubmit)}
//       >
//         <div className="grid grid-cols-2 gap-x-4">
//           <FormField
//             control={form.control}
//             name="subjectId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("subject")}</FormLabel>
//                 <FormControl>
//                   <SubjectSelector
//                     defaultValue={
//                       lesson?.subjectId ? `${lesson.subjectId}` : undefined
//                     }
//                     classroomId={params.id}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-x-4">
//           <FormField
//             control={form.control}
//             name="isRepeating"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-center gap-2">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={(checked) =>
//                       field.onChange(checked === true)
//                     }
//                   />
//                 </FormControl>
//                 <FormLabel>{t("Repeat every week?")}</FormLabel>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-x-4">
//           <FormField
//             control={form.control}
//             name="startDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Date")}</FormLabel>
//                 <FormControl>
//                   <DatePicker
//                     defaultValue={field.value}
//                     onChange={field.onChange}
//                   />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="startTime"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("start_time")}</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder={t("start_time")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {hours24.map((hour) => (
//                         <SelectItem key={hour} value={hour}>
//                           {hour}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-x-4">
//           <FormField
//             control={form.control}
//             name="endDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("Date")}</FormLabel>
//                 <FormControl>
//                   <DatePicker
//                     defaultValue={field.value}
//                     onChange={field.onChange}
//                   />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="endTime"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t("end_time")}</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder={t("end_time")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {filteredEndTimes.map((hour) => (
//                         <SelectItem key={hour} value={hour}>
//                           {hour}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="mt-4 flex flex-row items-center justify-end gap-2">
//           <Button
//             onClick={() => {
//               closeModal();
//             }}
//             type="button"
//             variant={"outline"}
//             size={"sm"}
//           >
//             {t("cancel")}
//           </Button>
//           <Button
//             type="submit"
//             isLoading={createLessonMutation.isPending}
//             size={"sm"}
//           >
//             {t("submit")}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
