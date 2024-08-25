import { useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeletePopover } from "@/components/shared/buttons/delete-popover";
import { ViewButton } from "@/components/shared/buttons/view-button";
import { useLocale } from "@/hooks/use-locale";
import { api } from "@/trpc/react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Separator } from "@repo/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";
import { Forward, Mail, MoreVertical, Reply } from "lucide-react";

export default function StudentsDetails() {
  const params = useParams<{ id: string }>();

  const studentQuery = api.student.get.useQuery(params.id);

  const { t } = useLocale();

  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <ViewButton
            className="border-none"
            asLink
            target="_blank"
            href={`/students?id=${studentQuery.data?.id}`}
          />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <DeletePopover
                title={t("delete")}
                className="border-none"
                disabled={!studentQuery.data || isDeletePending}
                description={t("delete_confirmation")}
                onDelete={() => {}}
              />
            </TooltipTrigger>
            <TooltipContent>{t("delete")}</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`${studentQuery.data ? "/mail/?mailto:xx@gmail.com" : "#"}`}
                target="_blank"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{t("email")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                //onClick={prevStudent}
                variant="ghost"
                size="icon"
                disabled={!studentQuery.data}
              >
                <Reply className="h-4 w-4" />
                <span className="sr-only">{t("prev_student")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("prev_student")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                //onClick={nextStudent}
                variant="ghost"
                size="icon"
                disabled={!studentQuery.data}
              >
                <Forward className="h-4 w-4" />
                <span className="sr-only">{t("next_student")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("next_student")}</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!studentQuery.data}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("plus")}</DropdownMenuItem>
            {/*<DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {/*student ? (
        <div className="flex pt-2 text-sm flex-col gap-1 items-center">
          {isFetching ? (
            <div className="items-center justify-between">
              <CircularLoader />
            </div>
          ) : (
            <>
              <Avatar className="rounded-none flex h-[150px] w-[150px] items-center justify-center space-y-0">
                <AvatarImage src={student?.avatar ?? ""} alt="Avatar" />
                <AvatarFallback className="rounded-none">JL</AvatarFallback>
              </Avatar>
              <StudentDetail />
            </>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          {t("no_student_selected")}
        </div>
      )*/}
    </div>
  );
}

// function StudentDetail() {
//   const params = useParams();
//   const { t } = useLocale();
//   const { schoolYearId } = useSchoolYearQuery();

//   const enr = student?.enrollments?.find((e) => e.schoolYearId == schoolYearId);
//   const classroom = enr?.classroom;
//   const { fullDateFormatter } = useDateFormat();
//   const dateOfBirth = fullDateFormatter.format(
//     new Date(student?.dateOfBirth ?? "")
//   );
//   console.log(student?.dateOfExit);
//   //const contacts = student?.studentContacts || [];
//   const contacts: any[] = [];
//   return (
//     <div className="w-full px-4 flex flex-col gap-2 items-start justify-start">
//       <div className="w-full px-2 py-1 rounded-md text-primary-foreground bg-primary">
//         {t("information")}
//       </div>
//       <div className="w-full">
//         {getFullName(student)}
//       </div>
//       <div className="w-full">
//         <div>{student?.email}</div>
//       </div>
//       <div className="w-full ">
//         <div>{dateOfBirth}</div>
//       </div>
//       <div className="w-full">
//         <div>{student?.residence}</div>
//       </div>
//       <div className="text-orange-500 grid w-full grid-cols-2">
//         <div>{t("dateOfEntry")}</div>
//         <div>
//           {student?.dateOfEntry &&
//             fullDateFormatter.format(new Date(student?.dateOfEntry))}
//         </div>
//         <div>{t("dateOfExit")}</div>
//         <div>
//           {student?.dateOfExit &&
//             fullDateFormatter.format(new Date(student?.dateOfExit))}
//         </div>
//         <div className="col-span-2 text-blue-500 flex-wrap">
//           {student?.observation}
//         </div>
//       </div>
//       <div className="w-full bg-secondary px-2 py-1 rounded-sm">
//         <div className="font-semibold">{t("classroom")} : </div>
//         <div>{classroom?.shortName}</div>
//       </div>
//       <div>{t("last_login")}</div>
//       <div className="ml-4 w-full grid grid-cols-2 text-green-500">
//         <div>{t("student")}</div>
//         <div> {fullDateFormatter.format(new Date())}</div>
//         <div>{t("contacts")}</div>
//         <div> {fullDateFormatter.format(new Date())}</div>
//       </div>
//       <div className="w-full px-2 py-1 rounded-md text-primary-foreground bg-primary">
//         {t("attendance")}
//       </div>
//       <div className="text-violet-500 ml-4 grid grid-cols-2 w-full">
//         <div>{t("today_attendance")}</div>
//         <div> {t("absent")}</div>
//         <div>{t("total_attendance")}</div>
//         <div>Absence: 8, retard: 15</div>
//       </div>
//       <div className="w-full flex flex-col gap-2">
//         <div className="w-full flex items-center justify-between px-2 py-1 rounded-md text-primary-foreground bg-primary">
//           <div>{t("contacts")}</div>
//           <div>
//             <Link
//               target="_blank"
//               className="flex flex-row items-center"
//               href={`/mail?mailto:all@gmail.com&compose`}
//             >
//               <Mail className={"w-4 h-4"} />
//             </Link>
//           </div>
//         </div>
//         {contacts.map((c, i) => {
//           return (
//             <Fragment key={i}>
//               <div className="flex flex-row gap-2 items-start ">
//                 <Avatar className="flex h-[60px] w-[60px] items-center justify-center space-y-0">
//                   <AvatarImage src={c.contact?.avatar ?? ""} alt="Avatar" />
//                   <AvatarFallback>
//                     {c.contact?.firstName?.charAt(0)}
//                     {c.contact?.lastName?.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <Link
//                     href={`/contacts?id=${c.contact?.id}`}
//                     target="_blank"
//                     className="flex text-blue-500 flex-row items-center hover:underline"
//                   >
//                     <div>
//                       {c.contact?.prefix ?? "M."} {c.contact?.lastName}{" "}
//                       {c.contact?.firstName} ({c.relationship?.name})
//                     </div>
//                     <ExternalLinkIcon className={"w-4 h-4 ml-1"} />
//                   </Link>
//                   <div>{c.contact?.title} </div>
//                   <div>
//                     <Link
//                       target="_blank"
//                       className="flex flex-row items-center hover:underline"
//                       href={`/mail?mailto:${c.contact?.email}&compose`}
//                     >
//                       {c.contact?.email}
//                       <ExternalLinkIcon className={"w-4 h-4 ml-2"} />
//                     </Link>
//                   </div>
//                   <div>
//                     <span>
//                       {c.contact?.address}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="font-bold">
//                       {c.contact?.phoneNumber1}{" "}
//                       {c.contact?.phoneNumber2 && "/" + c.contact?.phoneNumber2}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <Separator className="w-full" />
//             </Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
