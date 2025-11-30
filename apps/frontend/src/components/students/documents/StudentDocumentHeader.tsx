"use client";

import { FolderOpen, UploadCloudIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { CreateEditDocument } from "~/components/shared/CreateEditDocument";
import { useModal } from "~/hooks/use-modal";

export function StudentDocumentHeader({ userId }: { userId: string }) {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 border-b px-4 py-1">
      <FolderOpen className="hidden h-4 w-4 md:block" />
      <Label className="hidden md:block">{t("documents")}</Label>
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
