"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { useDebounce } from "@repo/hooks/use-debounce";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import { EmptyState } from "@repo/ui/EmptyState";
import { Skeleton } from "@repo/ui/skeleton";

//import { DialogProps } from "@radix-ui/react-alert-dialog";
import rangeMap from "~/lib/range-map";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

type StudentSelectorProps = DialogProps & {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};
export function StudentSelector({ ...props }: StudentSelectorProps) {
  //const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [searchText, setSearchText] = React.useState("");
  const [value, setValue] = React.useState<string | null>(null);

  const debounceValue = useDebounce(searchText, 500);
  const studentsQuery = api.student.all.useQuery({
    q: debounceValue,
  });

  const { t } = useLocale();

  const runCommand = React.useCallback(
    (studentId: string, fullName: string) => {
      setOpen(false);
      props.onChange?.(studentId);
      setValue(fullName);
    },
    [props],
  );

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "flex w-full justify-between bg-background text-sm font-normal text-muted-foreground shadow-none",
          props.className,
        )}
        onClick={() => setOpen(true)}
      >
        <span>{value ?? t("select_a_student")}</span>
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          onValueChange={setSearchText}
          placeholder={t("search_for_an_option")}
        />
        <CommandList>
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
              className="flex items-center px-2 py-1"
              key={student.id}
              onSelect={() => runCommand(student.id, getFullName(student))}
            >
              {getFullName(student)}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
