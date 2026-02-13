"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function AddUserSelector({ roleId }: { roleId: string }) {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const addUserMutation = useMutation(
    trpc.role.addUsers.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        await queryClient.invalidateQueries(trpc.permission.pathFilter());
        await queryClient.invalidateQueries(trpc.user.search.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
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
    <div className="grid grid-cols-1 gap-4">
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
              <AvatarState name={u.name} zoomable={false} />
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
      <div className="flex h-5 items-center gap-1">
        {selected.map((s, index) => {
          return <AvatarState key={index} name={s.name} zoomable={false} />;
        })}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={addUserMutation.isPending}
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("close")}
        </Button>
        <Button
          disabled={addUserMutation.isPending}
          onClick={() => {
            const values = selected.map((s) => s.id);
            toast.loading(t("Processing"), {
              id: 0,
            });
            addUserMutation.mutate({
              roleId,
              userIds: values,
            });
          }}
        >
          {addUserMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
