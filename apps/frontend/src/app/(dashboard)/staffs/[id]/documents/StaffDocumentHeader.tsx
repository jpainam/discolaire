"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";

import { useModal } from "~/hooks/use-modal";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";

export function StaffDocumentHeader({ userId }: { userId: string }) {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center pt-2">
      <FolderOpen className="mr-2 h-4 w-4" />
      <Label>{t("documents")}</Label>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              className: "w-[600px]",
              title: `${t("upload")} ${t("document")}`,
              view: <CreateEditDocument ownerId={userId} />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          {t("upload")}
        </Button>
      </div>
    </div>
  );
}
