"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSheet } from "@/hooks/use-sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@repo/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/sheet";

export default function GlobalSheet() {
  const { isOpen, view, placement, title, description, className, closeSheet } =
    useSheet();
  const pathname = usePathname();
  useEffect(() => {
    closeSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          {title || description ? <Separator /> : null}
        </SheetHeader>
        {view}
      </SheetContent>
    </Sheet>
  );
}
