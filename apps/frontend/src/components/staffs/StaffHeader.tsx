"use client";

import { useSearchParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import { useQueryState } from "nuqs";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
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
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { StaffLevelSelector } from "../shared/selects/StaffLevelSelector";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader() {
  const { t } = useLocale();
  const jobTitlesQuery = api.staff.jobTitles.useQuery();

  const canCreateStaff = useCheckPermissions(
    PermissionAction.CREATE,
    "staff:profile",
  );

  const jobTitles = jobTitlesQuery.data ?? [];

  const [level, setLevel] = useQueryState("level", { shallow: false });

  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-4 py-2">
      {<FilterJobTitle jobTitles={jobTitles as string[]} />}
      <GenderFilter />

      <StaffLevelSelector
        defaultValue={level ? level : undefined}
        onChange={(val) => setLevel(val == "" ? null : val)}
      />

      <Separator orientation="vertical" />
      <StaffEffectif />

      <div className="ml-auto flex flex-row gap-2">
        {canCreateStaff && (
          <Button
            onClick={() => {
              openSheet({
                title: t("create_staff"),
                className: "w-[750px]",
                view: <CreateEditStaff />,
              });
            }}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
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
        defaultValue={jobTitle ?? "*"}
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
      defaultValue={gender ?? "*"}
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
