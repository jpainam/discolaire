"use client";

import type { LinkProps } from "next/link";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlignLeftIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@repo/ui/dropdown-menu";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/sheet";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/configs/site";
import { cn } from "~/lib/utils";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { t } = useLocale();
  const mobileNav = [
    { href: "/", label: t("home") },
    {
      href: "/datum",
      label: t("datum"),
      items: [
        { href: "/datum", label: t("datum") },
        { href: "/datum/classrooms", label: t("classrooms") },
        { href: "/datum/students", label: t("students") },
      ],
    },
    { href: "/programs", label: t("programs") },
    { href: "/report-cards", label: t("report_cards") },
    { href: "/reports", label: t("reportings") },
    { href: "/admin", label: t("administration") },
  ];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <AlignLeftIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {mobileNav.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    ///onOpenChange={setOpen}
                  >
                    {item.label}
                  </MobileLink>
                ),
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function MobileActionButtions() {
  const router = useRouter();
  return (
    <>
      <DropdownMenuSeparator className="flex md:hidden" />
      <DropdownMenuGroup className="flex flex-col md:hidden">
        <DropdownMenuItem>
          Favories
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Notifications
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/mail");
          }}
        >
          Messages
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Impression
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Aide</DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}
