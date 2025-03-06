"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import { useSheet } from "~/hooks/use-sheet";

export default function GlobalSheet() {
  const { isOpen, view, placement, title, description, className, closeSheet } =
    useSheet();
  const pathname = usePathname();
  useEffect(() => {
    closeSheet();
  }, [closeSheet, pathname]);

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          closeSheet();
        }
      }}
      open={isOpen}
    >
      <SheetContent className={className} side={placement}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {view}
      </SheetContent>
    </Sheet>
  );
}
