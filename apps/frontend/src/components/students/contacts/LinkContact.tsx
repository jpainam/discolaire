"use client";

import React, { useState } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { UserLink } from "~/components/UserLink";
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type Contact = NonNullable<
  RouterOutputs["student"]["unlinkedContacts"]
>[number];

export function LinkContact({ studentId }: { studentId: string }) {
  const t = useTranslations();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedContacts, setSelectedContacts] = React.useState<Contact[]>([]);
  const [relationship, setRelationship] = useState<string | null>(null);

  const studentUnLinkedContact = useQuery(
    trpc.student.unlinkedContacts.queryOptions({
      studentId: studentId,
      q: debounceValue,
    }),
  );

  const { closeModal } = useModal();
  const createStudentContactMutation = useMutation(
    trpc.studentContact.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
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

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-2">
        <RelationshipSelector
          className="w-full"
          showAllOption={false}
          onChange={(v) => {
            setRelationship(v);
          }}
        />
      </div>
      <Command
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        className="h-[250px] rounded-t-none border-t"
      >
        <CommandInput
          onValueChange={(val) => {
            setValue(val);
          }}
          placeholder={t("search")}
        />
        <CommandList>
          <CommandEmpty>{t("no_data")}</CommandEmpty>
          <ScrollArea className="h-[200px] w-full">
            <CommandGroup className="p-2">
              {studentUnLinkedContact.isPending && (
                <CommandItem className="flex flex-col items-center justify-center gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton className="h-8 w-full" key={index} />
                  ))}
                </CommandItem>
              )}
              {studentUnLinkedContact.data?.map((contact) => (
                <CommandItem
                  key={`${contact.id}-list`}
                  className="flex items-center px-2 py-1"
                  onSelect={() => {
                    if (selectedContacts.includes(contact)) {
                      return setSelectedContacts(
                        selectedContacts.filter(
                          (selectedContact) =>
                            selectedContact.id !== contact.id,
                        ),
                      );
                    }

                    return setSelectedContacts(
                      [...studentUnLinkedContact.data].filter((u) =>
                        [...selectedContacts, contact].includes(u),
                      ),
                    );
                  }}
                >
                  <UserLink
                    avatar={contact.avatar}
                    name={getFullName(contact)}
                    id={contact.id}
                    profile="contact"
                  />

                  {selectedContacts.includes(contact) ? (
                    <Check className="text-primary ml-auto flex h-5 w-5" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
      <div className="flex items-center border-t p-4 sm:justify-between">
        {selectedContacts.length > 0 ? (
          <div className="flex -space-x-2">
            {selectedContacts.map((contact) => {
              const avatar = createAvatar(initials, {
                seed: getFullName(contact),
              });
              return (
                <Avatar
                  key={`${contact.id}-selected`}
                  className="border-background inline-block size-8 border-2"
                >
                  <AvatarImage
                    src={contact.avatar ?? avatar.toDataUri()}
                    alt="Image"
                  />
                </Avatar>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">
            {t("select_students_to_add")}
          </span>
        )}
        <Button
          variant={"default"}
          disabled={
            selectedContacts.length === 0 ||
            createStudentContactMutation.isPending
          }
          onClick={() => {
            if (!relationship) {
              toast.error(t("please_select_relationship"));
              return;
            }
            toast.loading(t("Processing"), { id: 0 });
            createStudentContactMutation.mutate({
              contactId: selectedContacts.map((contact) => contact.id),
              studentId: studentId,
              data: {
                relationshipId: Number(relationship),
              },
            });
          }}
        >
          {createStudentContactMutation.isPending && <Spinner />}
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
