"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useModal } from "~/hooks/use-modal";

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
      <DialogContent className={className}>
        {title ?? description ? (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        ) : (
          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}

        {view}
      </DialogContent>
    </Dialog>
  );
}
