"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";

export default function GlobalModal() {
  const { isOpen, view, closeModal, title, description, className } =
    useModal();
  const pathname = usePathname();
  useEffect(() => {
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent className={cn("sm:max-w-none", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {view}
      </DialogContent>
    </Dialog>
  );
}
