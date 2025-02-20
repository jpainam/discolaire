"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useDebounce } from "@repo/hooks/use-debounce";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
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
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { getErrorMessage } from "~/lib/handle-error";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

type Contact = NonNullable<
  RouterOutputs["student"]["unlinkedContacts"]
>[number];

export function LinkContact({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);
  const [selectedContacts, setSelectedContacts] = React.useState<Contact[]>([]);
  const [relationship, setRelationship] = useState<string | null>(null);

  const studentUnLinkedContact = api.student.unlinkedContacts.useQuery({
    studentId: studentId,
    q: debounceValue,
  });

  const { closeModal } = useModal();
  const createStudentContactMutation = api.studentContact.create2.useMutation();
  const utils = api.useUtils();
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-2">
        <RelationshipSelector
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
          placeholder={t("search_a_student")}
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
                      src={contact.avatar ?? undefined}
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
                  <div className="ml-2">
                    <span className="text-xs font-medium leading-none">
                      {contact.lastName} {contact.firstName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contact.email}
                    </span>
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
                <AvatarImage src={contact.avatar ?? undefined} alt="Image" />
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
            toast.promise(
              createStudentContactMutation.mutateAsync({
                contactId: selectedContacts.map((contact) => contact.id),
                studentId: studentId,
                data: {
                  relationshipId: Number(relationship),
                },
              }),
              {
                success: async () => {
                  await utils.contact.students.invalidate();
                  await utils.student.contacts.invalidate();
                  closeModal();
                  return t("added_successfully");
                },
                error: (error) => {
                  return getErrorMessage(error);
                },
              },
            );
          }}
        >
          {createStudentContactMutation.isPending && (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("link")}
        </Button>
      </div>
    </div>
  );
}
