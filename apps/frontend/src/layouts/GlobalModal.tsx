"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useModal } from "@repo/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";

import { cn } from "~/lib/utils";

export default function GlobalModal() {
  const { isOpen, view, closeModal, title, description, className } =
    useModal();
  const pathname = usePathname();
  useEffect(() => {
    closeModal();
  }, [closeModal, pathname]);

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
