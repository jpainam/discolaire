"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";

import { useTRPC } from "~/trpc/react";

export function QuickClassroomList() {
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );
  const locale = useLocale();
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    return classrooms.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [classrooms, query]);

  return (
    <div className="border-border bg-card relative flex max-h-[400px] flex-col overflow-hidden rounded-xl border">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-[15px] pb-4">
        <h2 className="text-foreground text-[15px] font-normal tracking-[-0.45px]">
          {t("classrooms")}
        </h2>

        <InputGroup className="w-[140px] sm:w-[180px] md:w-[235px]">
          <InputGroupInput
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex-1 overflow-y-auto px-[14px] pb-4">
        <div className="space-y-[8px]">
          {filtered.map((classroom) => {
            const avatar = createAvatar(initials, {
              seed: classroom.name,
            });
            return (
              <div
                key={classroom.id}
                className="border-border bg-sidebar hover:bg-sidebar-accent relative h-[46px] rounded-[10px] border px-[7px]"
              >
                <div className="grid h-full grid-cols-1 items-center gap-2 overflow-hidden sm:grid-cols-[minmax(0,1fr)_minmax(120px,auto)] sm:gap-3 md:grid-cols-[minmax(0,1fr)_minmax(140px,auto)_minmax(110px,auto)] md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(160px,auto)_minmax(130px,auto)_minmax(70px,auto)]">
                  <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                    <Avatar className="size-[26px] shrink-0">
                      <AvatarImage
                        src={avatar.toDataUri()}
                        alt={classroom.reportName}
                      />
                      <AvatarFallback>
                        {classroom.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/classrooms/${classroom.id}`}
                      className="text-foreground min-w-0 truncate text-[15px] font-normal tracking-[-0.45px] hover:underline"
                    >
                      {classroom.name}
                    </Link>
                  </div>

                  <div className="hidden min-w-0 items-center gap-2 overflow-hidden sm:flex">
                    {/* <Avatar className="size-[26px] shrink-0">
                      <AvatarImage
                        src={avatar.toDataUri()}
                        alt={classroom.reportName}
                      />
                      <AvatarFallback>
                        {classroom.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="text-foreground min-w-0 truncate text-[15px] font-normal tracking-[-0.45px] whitespace-nowrap">
                      {classroom.cycle?.name}
                    </span>
                  </div>

                  <div className="hidden min-w-0 items-center gap-2 overflow-hidden md:flex">
                    <CalendarDays className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-muted-foreground min-w-0 truncate text-[14px] font-normal tracking-[-0.42px] whitespace-nowrap">
                      {classroom.updatedAt.toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="hidden min-w-0 items-center overflow-hidden lg:flex">
                    <span className="text-muted-foreground min-w-0 truncate text-[15px] font-normal tracking-[-0.45px] whitespace-nowrap">
                      {classroom.size}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="from-card pointer-events-none absolute right-0 bottom-0 left-0 h-20 rounded-br-xl rounded-bl-xl bg-linear-to-t to-transparent" />
    </div>
  );
}
