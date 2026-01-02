"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useSheet } from "~/hooks/use-sheet";

export default function GlobalSheet() {
  const t = useTranslations();
  const {
    isOpen,
    view,
    placement,
    title,
    description,
    className,
    footer,
    formId,
    cancelText,
    submitText,
    closeSheet,
  } = useSheet();
  const pathname = usePathname();
  useEffect(() => {
    closeSheet();
  }, [closeSheet, pathname]);

  const shouldRenderFooter = Boolean(footer ?? formId);

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
        <div className="min-h-0 flex-1 overflow-y-auto px-4">{view}</div>
        {shouldRenderFooter ? (
          <SheetFooter>
            {footer ?? (
              <>
                <Button type="submit" form={formId}>
                  {submitText ?? t("submit")}
                </Button>
                <SheetClose asChild>
                  <Button variant={"outline"}>
                    {cancelText ?? t("cancel")}
                  </Button>
                </SheetClose>
              </>
            )}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
