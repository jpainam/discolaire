"use client";

import { useTranslations } from "next-intl";

import { Label } from "~/components/ui/label";
import { sidebarIcons } from "../sidebar-icons";

export function PhotoHeader() {
  const t = useTranslations();
  // const { school } = useSchool();
  const Icon = sidebarIcons.photos;

  return (
    <div className="bg-secondary text-secondary-foreground flex flex-row items-center gap-2 border-b p-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("photos")}</Label>
      <div className="ml-auto">
        <input
          //disabled={isPending}
          type="file"
          onChange={(_file) => {
            //const files = file.target.files;
          }}
        />
        {/* <Button  variant={"outline"} size={"sm"}>
          <UploadIcon className="mr-2 h-4 w-4" />
          {t("upload")}
        </Button> */}
      </div>
    </div>
  );
}
