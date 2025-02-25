"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import * as React from "react";

import { useDebounce } from "@repo/hooks/use-debounce";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { Skeleton } from "@repo/ui/components/skeleton";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";

//import { DialogProps } from "@radix-ui/react-alert-dialog";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

type StudentSelectorProps = DialogProps & {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function StudentSearch({ ...props }: StudentSelectorProps) {
  const [searchText, setSearchText] = React.useState("");

  const debounceValue = useDebounce(searchText, 500);
  const studentsQuery = api.student.all.useQuery({
    q: debounceValue,
  });

  const { t } = useLocale();

  const runCommand = React.useCallback(
    (studentId: string) => {
      props.setOpen(false);
      props.onChange?.(studentId);
    },
    [props]
  );

  return (
    <>
      <CommandDialog open={props.open} onOpenChange={props.setOpen}>
        <CommandInput
          onValueChange={setSearchText}
          placeholder={t("search_for_an_option")}
        />
        <CommandList className="h-[400px]">
          <CommandEmpty>
            <EmptyState />
          </CommandEmpty>
          {studentsQuery.isPending && (
            <CommandItem className="flex flex-col items-center justify-center gap-2">
              {rangeMap(10, (index) => (
                <Skeleton className="h-8 w-full" key={index} />
              ))}
            </CommandItem>
          )}
          {studentsQuery.data?.map((student) => (
            <CommandItem
              className="flex cursor-pointer items-center px-2 py-1"
              key={student.id}
              onSelect={() => runCommand(student.id)}
            >
              {getFullName(student)}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
