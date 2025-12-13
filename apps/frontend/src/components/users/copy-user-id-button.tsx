"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";

export function CopyUserIdButton({ userId }: { userId: string }) {
  const t = useTranslations();
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
