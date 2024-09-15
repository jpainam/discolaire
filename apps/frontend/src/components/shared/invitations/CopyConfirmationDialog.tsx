"use client";

import { CopyButton } from "@repo/ui/copy-button";
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
        <CopyButton content={invitationLink} />
      </div>
    </div>
  );
}
