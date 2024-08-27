"use client";

import Link from "next/link";
import type {
  LucideIcon} from "lucide-react";
import {
  BookOpenCheckIcon,
  BookUserIcon,
  ChevronDown,
  ChevronRight,
  LayoutList,
  MailIcon,
} from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { env } from "~/env";

interface ServiceItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  description: string;
}
export function ServiceSwitcher() {
  const { t } = useLocale();
  const services: ServiceItem[] = [
    {
      title: t("prospects"),
      href: env.NEXT_PUBLIC_PROSPECT_SERVICE_URL,
      description: t("prospects_description"),
      icon: BookUserIcon,
    },
    {
      title: t("library"),
      href: env.NEXT_PUBLIC_LIBRARY_SERVICE_URL,
      description: t("library_description"),
      icon: BookOpenCheckIcon,
    },
    {
      title: t("messaging"),
      href: "https://messaging.discolaire.com",
      description: t("messaging_description"),
      icon: MailIcon,
    },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-2 hover:bg-transparent hover:text-primary-foreground hover:dark:text-primary"
        >
          <LayoutList className="h-4 w-4" />
          {t("services")}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <div className="flex flex-col gap-4 p-2">
          {services.map((item, index) => (
            <ServiceSwitcherItem key={index} item={item} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const ServiceSwitcherItem = ({ item }: { item: ServiceItem }) => {
  const Icon = item.icon;
  return (
    <Link
      target="_blank"
      href={item.href || ""}
      className="flex flex-row items-center gap-2 rounded-lg pr-2 hover:bg-muted/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="line-clamp-1 text-sm font-semibold">{item.title}</span>
        <span className="line-clamp-2 text-xs text-muted-foreground">
          {item.description}
        </span>
      </div>
      <div className="ml-auto flex text-muted-foreground">
        <ChevronRight className="h-6 w-6" />
      </div>
    </Link>
  );
};
