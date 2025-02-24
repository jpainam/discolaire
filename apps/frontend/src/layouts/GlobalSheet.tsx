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

import { cn } from "~/lib/utils";

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
      <SheetContent
        className={cn("w-[400px] p-0 sm:max-w-none", className)}
        side={placement}
      >
        <SheetHeader className="gap-0 space-y-0 border-b p-2">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          {/* {title || description ? <Separator /> : null} */}
        </SheetHeader>
        {view}
      </SheetContent>
    </Sheet>
  );
}
