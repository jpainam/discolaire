"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";

export function StudentDocumentHeader({ userId }: { userId: string }) {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1">
      <FolderOpen className="h-4 w-4" />
      <Label>{t("documents")}</Label>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: `${t("upload")} ${t("document")}`,
              view: <CreateEditDocument ownerId={userId} />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <UploadCloudIcon className="h-4 w-4" />
          {t("upload")}
        </Button>
      </div>
    </div>
  );
}
