"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

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
import { toast } from "sonner";
import { randomAvatar } from "~/components/raw-images";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function EnrollStudent({ classroomId }: { classroomId: string }) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { closeModal } = useModal();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);

  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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
        closeModal();
        return t("enrolled_successfully");
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
    <div className="flex flex-col">
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
              {unenrollStudentsQuery.isPending && (
                <CommandItem className="flex flex-col items-center justify-center gap-2">
                  {rangeMap(10, (index) => (
                    <Skeleton className="h-8 w-full" key={index} />
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
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={stud.user?.avatar ?? undefined}
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
                  <div className="ml-2">
                    <span className="text-xs font-medium leading-none">
                      {getFullName(stud)}
                    </span>
                    {/* <span className="text-xs text-muted-foreground">
                      {stud.email}
                    </span> */}
                  </div>
                  {selectedIds.includes(stud.id) ? (
                    <Check className="ml-auto flex h-5 w-5 text-primary" />
                  ) : null}
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
              return (
                <Avatar
                  key={`${studId}-selected`}
                  className="inline-block border-2 border-background"
                >
                  <AvatarImage
                    src={stud?.user?.avatar ?? undefined}
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
          <span className="text-sm text-muted-foreground">
            {t("select_students_to_enroll")}
          </span>
        )}
        <Button
          variant={"default"}
          size={"sm"}
          isLoading={createEnrollmentMutation.isPending}
          disabled={selectedIds.length === 0}
          onClick={() => {
            toast.loading(t("Processing..."), { id: 0 });
            createEnrollmentMutation.mutate({
              studentId: selectedIds,
              classroomId: classroomId,
              observation: "",
            });
          }}
        >
          {t("enroll")}
        </Button>
      </div>
    </div>
  );
}
