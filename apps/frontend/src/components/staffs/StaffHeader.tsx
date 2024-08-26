"use client";

import { useSearchParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import { useQueryState } from "nuqs";

import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";

import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";
import { useCreateQueryString } from "../../hooks/create-query-string";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { StaffLevelSelector } from "../shared/selects/StaffLevelSelector";
import { Label } from "../ui/label";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader() {
  const { t } = useLocale();
  const { t: t2 } = useLocale("print");
  const jobTitlesQuery = api.staff.jobTitles.useQuery();
  const levels = api.staff.levels.useQuery();

  const jobTitles = jobTitlesQuery.data || [];
  const router = useRouter();
  const [level, setLevel] = useQueryState("level", { shallow: false });

  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-4 py-2">
      {jobTitles && <FilterJobTitle jobTitles={jobTitles as string[]} />}
      <GenderFilter />

      <StaffLevelSelector
        defaultValue={level ? level : undefined}
        onChange={(val) => setLevel(val == "" ? null : val)}
      />

      <Separator orientation="vertical" />
      <StaffEffectif />

      <div className="ml-auto flex flex-row gap-2">
        <Button
          onClick={() => {
            openSheet({
              className: "w-[750px]",
              view: <CreateEditStaff />,
            });
          }}
          size="icon"
          variant="outline"
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // toast.promise(
                //   publishReportQueue({
                //     code: "staff_list",
                //     name: t2("staff_list"),
                //     type: "pdf",
                //   }),
                //   {
                //     loading: "Publishing report queue...",
                //     success: () => {
                //       router.push(routes.reports.index);
                //       return "Report queue published";
                //     },
                //     error: (e) => {
                //       return getErrorMessage(e);
                //     },
                //   }
                // );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t2("staff_list")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                //   toast.promise(
                //     publishReportQueue({
                //       code: "staff_list",
                //       name: t2("staff_list"),
                //       type: "pdf",
                //     }),
                //     {
                //       loading: "Publishing report queue...",
                //       success: () => {
                //         router.push(routes.reports.index);
                //         return "Report queue published";
                //       },
                //       error: (e) => {
                //         return getErrorMessage(e);
                //       },
                //     }
                //   );
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t2("staff_list")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function FilterJobTitle({ jobTitles }: { jobTitles: string[] }) {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobTitle = searchParams.get("jobTitle");
  return (
    <div className="flex flex-row items-center gap-2">
      {/* <Label>{t("jobTitle")}</Label> */}
      <Select
        defaultValue={jobTitle || "*"}
        onValueChange={(v) => {
          router.push(
            `${routes.staffs.index}/?${createQueryString({ jobTitle: v })}`,
          );
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue>
            {jobTitle && jobTitle != "*" ? jobTitle : t("select_an_option")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"*"}>{t("all")}</SelectItem>
          {jobTitles.map((job) => {
            if (!job) return null;
            return (
              <SelectItem key={`${job}`} value={job}>
                {job}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

function GenderFilter() {
  const { t } = useLocale();
  const [gender, setGender] = useQueryState("gender", { shallow: false });
  return (
    <RadioGroup
      onValueChange={(v) => setGender(v == "*" ? null : v)}
      defaultValue={gender || "*"}
      className="flex flex-row"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="*" id="r1" />
        <Label htmlFor="r1">{t("all")}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="male" id="r2" />
        <Label htmlFor="r2">{t("male")}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="female" id="r3" />
        <Label htmlFor="r3">{t("female")}</Label>
      </div>
    </RadioGroup>
  );
}
