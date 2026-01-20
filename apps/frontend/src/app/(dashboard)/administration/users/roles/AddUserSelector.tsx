"use client";

import { useState } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function AddUserSelector({
  onSelectAction,
}: {
  onSelectAction: (values: string[]) => void;
}) {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);
  const [queryText, setQueryText] = useState<string>();
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 200);
  const { data: users, isPending } = useQuery(
    trpc.user.search.queryOptions({
      query: queryText,
      limit: 10,
    }),
  );
  const t = useTranslations();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <InputGroup>
          <InputGroupInput
            placeholder={t("search")}
            onChange={(e) => debounce(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <ScrollArea className="h-[250px]">
        {isPending && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 10 }).map((_, t) => (
              <Skeleton className="h-8" key={t} />
            ))}
          </div>
        )}
        {users?.map((u, index) => {
          const avatar = createAvatar(initials, {
            seed: u.name,
          });
          return (
            <div
              onClick={() => {
                if (selected.map((s) => s.id).includes(u.id)) {
                  // uncheck
                  setSelected((values) => values.filter((v) => v.id != u.id));
                } else {
                  setSelected([
                    ...selected,
                    {
                      id: u.id,
                      name: u.name,
                    },
                  ]);
                }
              }}
              key={index}
              className="flex items-center gap-2 border-b py-1"
            >
              <Avatar>
                <AvatarImage src={avatar.toDataUri()} />
                <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-muted-foreground text-xs">{u.name}</div>
              <Badge variant={"secondary"} className="text-primary">
                {u.username}
              </Badge>
              <div className="ml-auto flex pr-4">
                {selected.map((p) => p.id).includes(u.id) && (
                  <CheckIcon className="size-4" />
                )}
              </div>
            </div>
          );
        })}
      </ScrollArea>
      <div className="flex items-center gap-1">
        {selected.map((s, index) => {
          const av = createAvatar(initials, {
            seed: s.name,
          });
          return (
            <Avatar key={index}>
              <AvatarImage src={av.toDataUri()} />
              <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("close")}
        </Button>
        <Button
          onClick={() => {
            onSelectAction(selected.map((s) => s.id));
            closeModal();
          }}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
