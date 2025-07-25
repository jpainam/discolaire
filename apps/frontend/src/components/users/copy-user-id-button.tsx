"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";

import { useLocale } from "~/i18n";

export function CopyUserIdButton({ userId }: { userId: string }) {
  const { t } = useLocale();
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(userId);
        toast.success(t("user_id_copied"));
      }}
      variant={"ghost"}
      size="icon"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
