/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
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

import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { randomAvatar } from "../raw-images";

export function LinkStudent({ contactId }: { contactId: string }) {
  const t = useTranslations();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStudents, setSelectedStudents] = React.useState<any[]>([]);
  const [relationship, setRelationship] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const contactUnLinkedStudent = useQuery(
    trpc.contact.unlinkedStudents.queryOptions({
      contactId: contactId,
      q: debounceValue,
    }),
  );

  const { closeModal } = useModal();

  const createStudentContactMutation = useMutation(
    trpc.studentContact.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
        closeModal();
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
              {contactUnLinkedStudent.isPending && (
                <CommandItem className="flex flex-col items-center justify-center gap-2">
                  {rangeMap(10, (index) => (
                    <Skeleton className="h-8 w-full" key={index} />
                  ))}
                </CommandItem>
              )}
              {contactUnLinkedStudent.data?.map((stud) => (
                <CommandItem
                  key={`${stud.id}-list`}
                  className="flex items-center px-2 py-1"
                  onSelect={() => {
                    if (selectedStudents.includes(stud)) {
                      return setSelectedStudents(
                        selectedStudents.filter(
                          (selectedStudent) => selectedStudent.id !== stud.id,
                        ),
                      );
                    }

                    return setSelectedStudents(
                      [...contactUnLinkedStudent.data].filter((u) =>
                        [...selectedStudents, stud].includes(u),
                      ),
                    );
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={stud.user?.avatar ?? undefined}
                      alt="Image"
                    />
                    <AvatarFallback>
                      <Image
                        height={50}
                        width={50}
                        src={randomAvatar(getFullName(stud).length)}
                        alt="AV"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <span className="text-xs leading-none font-medium">
                      {getFullName(stud)}
                    </span>
                  </div>
                  {selectedStudents.includes(stud) ? (
                    <Check className="text-primary ml-auto flex h-5 w-5" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
      <div className="flex items-center border-t p-4 sm:justify-between">
        {selectedStudents.length > 0 ? (
          <div className="flex -space-x-2">
            {selectedStudents.map((stud) => (
              <Avatar
                key={`${stud.id}-selected`}
                className="border-background inline-block border-2"
              >
                <AvatarImage src={stud.avatar ?? undefined} alt="Image" />
                <AvatarFallback>
                  <Image
                    width={50}
                    height={50}
                    src={randomAvatar(getFullName(stud).length)}
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
          size={"sm"}
          variant={"default"}
          isLoading={createStudentContactMutation.isPending}
          disabled={selectedStudents.length === 0}
          onClick={() => {
            if (!relationship) {
              toast.error(t("please_select_relationship"));
              return;
            }
            toast.loading(t("loading"), {
              id: 0,
            });
            createStudentContactMutation.mutate({
              studentId: selectedStudents.map((stud) => stud.id as string),
              contactId: contactId,
              data: {
                relationshipId: Number(relationship),
              },
            });
          }}
        >
          {t("link")}
        </Button>
      </div>
    </div>
  );
}
