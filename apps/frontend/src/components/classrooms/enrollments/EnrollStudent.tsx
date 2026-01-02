"use client";

import React, { useState } from "react";
import Image from "next/image";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { randomAvatar } from "~/components/raw-images";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { UserLink } from "~/components/UserLink";
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function EnrollStudent({ classroomId }: { classroomId: string }) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { closeModal } = useModal();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  //const router = useRouter();

  const unenrollStudentsQuery = useQuery(
    trpc.enrollment.unenrolled.queryOptions({
      q: debounceValue,
    }),
  );

  const createEnrollmentMutation = useMutation(
    trpc.enrollment.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.enrollment.unenrolled.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
        closeModal();
        toast.success(t("enrolled_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: 0,
          position: "top-center",
          duration: 5000,
          className: "w-[300px]",
        });
        //toast.error(error.message, { id: 0 });
      },
    }),
  );
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };
  return (
    <div className="flex flex-col">
      <Command
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        className="bg-transparent"
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
            <CommandGroup>
              {unenrollStudentsQuery.isPending && (
                <CommandItem className="flex flex-col items-center justify-center gap-2">
                  {Array.from({ length: 10 }).map((_, t) => (
                    <Skeleton className="h-8 w-full" key={t} />
                  ))}
                </CommandItem>
              )}
              {unenrollStudentsQuery.data?.map((stud) => (
                <CommandItem
                  key={`${stud.id}-list`}
                  className="flex items-center px-2 py-1"
                  onSelect={() => {
                    if (selectedIds.includes(stud.id)) {
                      return setSelectedIds(
                        selectedIds.filter(
                          (selectedId) => selectedId !== stud.id,
                        ),
                      );
                    }

                    return setSelectedIds(
                      unenrollStudentsQuery.data
                        .filter((u) => [...selectedIds, stud.id].includes(u.id))
                        .map((u) => u.id),
                    );
                  }}
                >
                  <UserLink
                    profile="student"
                    id={stud.id}
                    rootClassName="flex-1"
                    className="text-muted-foreground text-xs"
                    avatar={stud.avatar}
                    href="#"
                    name={getFullName(stud)}
                  />

                  {/* <span className="text-xs text-muted-foreground">
                      {stud.email}
                    </span> */}

                  <div className="flex flex-row justify-end">
                    {selectedIds.includes(stud.id) ? (
                      <Check className="text-primary flex h-5 w-5 justify-end" />
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
      <div className="flex items-center border-t p-4 sm:justify-between">
        {selectedIds.length > 0 ? (
          <div className="flex -space-x-2">
            {selectedIds.map((studId) => {
              const stud = unenrollStudentsQuery.data?.find(
                (u) => u.id === studId,
              );
              const avatar = createAvatar(initials, {
                seed: getFullName(stud),
              });
              return (
                <Avatar
                  key={`${studId}-selected`}
                  className="border-background inline-block border-2"
                >
                  <AvatarImage
                    src={stud?.avatar ?? avatar.toDataUri()}
                    alt="Image"
                  />
                  <AvatarFallback>
                    <Image
                      width={50}
                      height={50}
                      src={randomAvatar(getFullName(stud).length)}
                      alt="AV"
                    />
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        ) : (
          <Label>{t("select_students_to_enroll")}</Label>
        )}
        <Button
          variant={"default"}
          disabled={
            selectedIds.length === 0 || createEnrollmentMutation.isPending
          }
          onClick={() => {
            toast.loading(t("Processing"), { id: 0 });
            createEnrollmentMutation.mutate({
              studentId: selectedIds,
              classroomId: classroomId,
              observation: "",
            });
          }}
        >
          {createEnrollmentMutation.isPending && <Spinner />}
          {t("enroll")}
        </Button>
      </div>
    </div>
  );
}
