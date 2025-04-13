"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useParams } from "next/navigation";
import { CreateEditDocument } from "~/components/shared/CreateEditDocument";

export function StaffDocumentHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();
  return (
    <div className="flex flex-row items-center px-2 gap-2 pt-2">
      <FolderOpen className="h-4 w-4" />
      <Label>{t("documents")}</Label>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: `${t("upload")} ${t("document")}`,
              view: (
                <CreateEditDocument entityId={params.id} entityType="staff" />
              ),
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <UploadCloudIcon />
          {t("upload")}
        </Button>
      </div>
    </div>
  );
}
