"use client";

import { Check, Loader } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
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
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { randomAvatar } from "~/components/raw-images";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type Contact = NonNullable<
  RouterOutputs["student"]["unlinkedContacts"]
>[number];

export function LinkContact({ studentId }: { studentId: string }) {
  const { t } = useLocale();
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
    trpc.studentContact.create2.mutationOptions({
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
                  {rangeMap(10, (index) => (
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
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={contact.user?.avatar ?? undefined}
                      alt="Image"
                    />
                    <AvatarFallback>
                      <Image
                        height={50}
                        width={50}
                        src={randomAvatar(getFullName(contact).length)}
                        alt="AV"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 text-xs font-medium leading-none">
                    {getFullName(contact)}
                  </div>
                  {selectedContacts.includes(contact) ? (
                    <Check className="ml-auto flex h-5 w-5 text-primary" />
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
            {selectedContacts.map((contact) => (
              <Avatar
                key={`${contact.id}-selected`}
                className="inline-block border-2 border-background"
              >
                <AvatarImage
                  src={contact.user?.avatar ?? undefined}
                  alt="Image"
                />
                <AvatarFallback>
                  <Image
                    width={50}
                    height={50}
                    src={randomAvatar(getFullName(contact).length)}
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
          size={"sm"}
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
            toast.loading(t("Processing..."), { id: 0 });
            createStudentContactMutation.mutate({
              contactId: selectedContacts.map((contact) => contact.id),
              studentId: studentId,
              data: {
                relationshipId: Number(relationship),
              },
            });
          }}
        >
          {createStudentContactMutation.isPending && (
            <Loader className="h-4 w-4 animate-spin" />
          )}
          {t("link")}
        </Button>
      </div>
    </div>
  );
}
