import { t } from "i18next";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

export function CopyConfirmationDialog({
  invitationLink,
}: {
  invitationLink: string;
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <Input value={invitationLink} readOnly className="w-full" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            void navigator.clipboard.writeText(invitationLink);
            toast.success(t("copied"));
          }}
        >
          <CopyIcon className="h-4 w-4" />
          <span className="sr-only">Copy Invite Link</span>
        </Button>
      </div>
    </div>
  );
}
