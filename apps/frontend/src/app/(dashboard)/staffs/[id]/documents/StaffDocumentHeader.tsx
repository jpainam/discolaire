"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";
import { useModal } from "~/hooks/use-modal";

export function StaffDocumentHeader({ userId }: { userId: string }) {
  const t = useTranslations();
  const { openModal } = useModal();

  return (
    <div className="flex flex-row items-center gap-2 px-4 pt-2">
      <FolderOpen className="h-4 w-4" />
      <Label>{t("documents")}</Label>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: `${t("upload")} ${t("document")}`,
              view: <CreateEditDocument userId={userId} />,
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
