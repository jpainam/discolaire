"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

import { useDebounce } from "~/hooks/use-debounce";
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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { randomAvatar } from "~/components/raw-images";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";

export function AddUserToRole({ roleId }: { roleId: string }) {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);
  const [selectedUserIds, setSelectedUserIds] = React.useState<
    { id: string; avatar?: string }[]
  >([]);
  const utils = api.useUtils();

  const existingUsers = api.role.users.useQuery({
    roleId: roleId,
  });
  const usersQuery = api.user.all.useQuery({
    q: debounceValue,
  });

  const { closeModal } = useModal();
  const addUserToRole = api.role.addUsers.useMutation({
    onSettled: () => utils.role.invalidate(),
    onSuccess: () => {
      closeModal();
      toast.success(t("added_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

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
                      <span className="text-xs font-medium leading-none">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    {selectedUserIds.map((u) => u.id).includes(user.id) ? (
                      <Check className="ml-auto flex h-5 w-5 text-primary" />
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
                className="inline-block border-2 border-background"
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
          <span className="text-sm text-muted-foreground">
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
