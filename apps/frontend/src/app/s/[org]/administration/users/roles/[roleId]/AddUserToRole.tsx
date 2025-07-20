"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";

import { randomAvatar } from "~/components/raw-images";
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";

export function AddUserToRole({ roleId }: { roleId: string }) {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedUserIds, setSelectedUserIds] = React.useState<
    { id: string; avatar?: string }[]
  >([]);

  const existingUsers = useQuery(
    trpc.role.users.queryOptions({
      roleId: roleId,
    }),
  );

  const usersQuery = useQuery(
    trpc.user.search.queryOptions({
      query: debounceValue,
    }),
  );

  const { closeModal } = useModal();
  const addUserToRole = useMutation(
    trpc.role.addUsers.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };
  const exitstingUserIds = existingUsers.data?.map((user) => user.userId) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <Command
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        className="h-[250px] rounded-t-none border-t"
      >
        <CommandInput
          onValueChange={(val) => {
            setValue(val);
          }}
          placeholder={t("search_a_user")}
        />
        <CommandList>
          <CommandEmpty>{t("no_data")}</CommandEmpty>
          <ScrollArea className="h-[200px] w-full">
            <CommandGroup className="p-2">
              {usersQuery.isPending && (
                <CommandItem className="flex flex-col items-center justify-center gap-2">
                  {rangeMap(10, (index) => (
                    <Skeleton className="h-8 w-full" key={index} />
                  ))}
                </CommandItem>
              )}
              {usersQuery.data
                ?.filter((ur) => !exitstingUserIds.includes(ur.id))
                .map((user) => (
                  <CommandItem
                    key={`${user.id}-list`}
                    className="flex items-center px-2 py-2"
                    onSelect={() => {
                      if (selectedUserIds.map((w) => w.id).includes(user.id)) {
                        return setSelectedUserIds(
                          selectedUserIds.filter(
                            (selectedUser) => selectedUser.id !== user.id,
                          ),
                        );
                      }

                      return setSelectedUserIds(
                        [...selectedUserIds, user].map((u) => {
                          return { id: u.id, avatar: u.avatar ?? undefined };
                        }),
                      );
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar ?? undefined} alt="Image" />
                      <AvatarFallback>
                        <Image
                          height={50}
                          width={50}
                          src={randomAvatar(user.id.length)}
                          alt="AV"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex flex-col">
                      <span className="text-xs leading-none font-medium">
                        {user.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {user.email}
                      </span>
                    </div>
                    {selectedUserIds.map((u) => u.id).includes(user.id) ? (
                      <Check className="text-primary ml-auto flex h-5 w-5" />
                    ) : null}
                  </CommandItem>
                ))}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
      <div className="flex items-center border-t p-4 sm:justify-between">
        {selectedUserIds.length > 0 ? (
          <div className="flex -space-x-2">
            {selectedUserIds.map((user) => (
              <Avatar
                key={`${user.id}-selected`}
                className="border-background inline-block border-2"
              >
                <AvatarImage src={user.avatar ?? undefined} alt="Image" />
                <AvatarFallback>
                  <Image
                    width={50}
                    height={50}
                    src={user.avatar ?? randomAvatar(user.id.length)}
                    alt="AV"
                  />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">
            {t("select_students_to_add")}
          </span>
        )}
        <Button
          variant={"default"}
          disabled={selectedUserIds.length === 0}
          isLoading={addUserToRole.isPending}
          onClick={() => {
            addUserToRole.mutate({
              roleId: roleId,
              userIds: selectedUserIds.map((u) => u.id),
            });
          }}
        >
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
