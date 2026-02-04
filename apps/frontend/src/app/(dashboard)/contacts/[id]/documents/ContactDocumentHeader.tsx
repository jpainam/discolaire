"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";

export function ContactDocumentHeader({ contactId }: { contactId: string }) {
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
              view: (
                <CreateEditDocument entityId={contactId} entityType="contact" />
              ),
            });
          }}
          variant={"default"}
        >
          <UploadCloudIcon />
          {t("upload")}
        </Button>
      </div>
    </div>
  );
}
