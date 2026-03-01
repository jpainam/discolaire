"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { ScrollArea } from "~/components/ui/scroll-area";
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
    return classrooms.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.cycle?.name ?? "").toLowerCase().includes(query.toLowerCase()),
    );
  }, [classrooms, query]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("Classroom list")}</CardTitle>
        <CardAction>
          <InputGroup className="w-52">
            <InputGroupInput
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search")}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2">
        <ScrollArea className="h-75">
          <div className="space-y-1">
            {filtered.map((classroom) => {
              const avatar = createAvatar(initials, {
                seed: classroom.name,
                scale: 65,
              });
              return (
                <Link
                  key={classroom.id}
                  href={`/classrooms/${classroom.id}`}
                  className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={avatar.toDataUri()} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-xs font-medium hover:underline">
                      {classroom.name}
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {classroom.cycle?.name}
                    </p>
                  </div>
                  <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-[10px]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {classroom.updatedAt.toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-foreground w-6 shrink-0 text-right text-xs font-semibold">
                    {classroom.size}
                  </span>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
