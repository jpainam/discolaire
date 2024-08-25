"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { routes } from "@/configs/routes";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { useLocale } from "@/hooks/use-locale";
import { useRouter } from "@/hooks/use-router";
import { useSheet } from "@/hooks/use-sheet";
import { getErrorMessage } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";
import { Forward, MoreVertical, Pencil, Reply } from "lucide-react";
import { toast } from "sonner";

import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { Separator } from "../ui/separator";
import { CreateEditClassroom } from "./CreateEditClassroom";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { t: t2 } = useLocale("print");
  const { createQueryString } = useCreateQueryString();
  //const [nextClassroom, setNextClassroom] = useState<Classroom | null>(null);
  //const [prevClassroom, setPrevClassrom] = useState<Classroom | null>(null);
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const classroomsQuery = api.classroom.all.useQuery();
  const classroomQuery = api.classroom.get.useQuery(params.id);

  useEffect(() => {
    if (!params.id || !classroomsQuery.data) return;
    const currentClassroomIdx = classroomsQuery.data?.findIndex(
      (s) => s.id === params.id,
    );
    if (!classroomsQuery.data) return;
    // setPrevClassrom(
    //   classroomsQuery.data
    //     ? classroomsQuery.data[currentClassroomIdx - 1]
    //     : null
    // );
    // setNextClassroom(classrooms[currentClassroomIdx + 1] || null);
  }, [params.id, classroomsQuery.data]);

  const handleClassroomChange = (value: string) => {
    if (params.id) {
      if (!pathname.includes(params.id as string)) {
        router.push(`${pathname}/${params.id}/?${createQueryString({})}`);
        return;
      }
      const newPath = pathname.replace(params.id as string, value);
      router.push(`${newPath}/?${createQueryString({})}`);
    } else {
      router.push(routes.classrooms.details(value));
    }
  };
  const { openSheet } = useSheet();
  return (
    <div className="grid w-full flex-row items-center gap-2 border-b px-2 py-1 md:flex">
      <ClassroomSelector
        className="w-full md:w-[300px]"
        defaultValue={params.id as string}
        onChange={(value) => {
          value && handleClassroomChange(value);
        }}
      />
      <div className="flex items-center gap-2 md:ml-auto">
        {classroomQuery.data && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  //disabled={!prevClassroom}
                  variant="outline"
                  onClick={() => {
                    openSheet({
                      className: "w-[700px]",
                      title: (
                        <div className="p-2">
                          {t("edit")} {classroomQuery.data?.name}
                        </div>
                      ),
                      view: (
                        <CreateEditClassroom classroom={classroomQuery?.data} />
                      ),
                    });
                  }}
                  size="icon"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">{t("create")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("prev")}</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              //disabled={!prevClassroom}
              variant="outline"
              onClick={() => {
                // prevClassroom &&
                //   router.push(
                //     pathname.replace(params.id as string, prevClassroom.id)
                //   );
              }}
              size="icon"
            >
              <Reply className="h-4 w-4" />
              <span className="sr-only">{t("prev")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("prev")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              //disabled={!nextClassroom}
              onClick={() => {
                // nextClassroom &&
                //   router.push(
                //     pathname.replace(params.id as string, nextClassroom.id)
                //   );
              }}
              variant="outline"
              size="icon"
            >
              <Forward className="h-4 w-4" />
              <span className="sr-only">{t("next")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("next")}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast.promise(Promise.resolve(), {
                  loading: t2("exporting_classroom_information"),
                  success: () => {
                    router.push(routes.reports.index);
                    return t2("classroom_information_exported_successfully");
                  },
                  error: (e) => {
                    console.error(e);
                    return getErrorMessage(e);
                  },
                });
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t2("classroom_information")}
            </DropdownMenuItem>
            <DropdownMenuItem
              // TODO implement exporting staff information
              onClick={() => {
                toast.promise(Promise.resolve(), {
                  loading: t2("exporting_classroom_information"),
                  success: () => {
                    router.push(routes.reports.index);
                    return t2("classroom_information_exported_successfully");
                  },
                  error: (e) => {
                    console.error(e);
                    return getErrorMessage(e);
                  },
                });
              }}
            >
              <XMLIcon className="mr-2 size-4" /> {t2("classroom_information")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
