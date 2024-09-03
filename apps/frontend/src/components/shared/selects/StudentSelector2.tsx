"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

//import { DialogProps } from "@radix-ui/react-alert-dialog";

import { useDebounce } from "@repo/hooks/use-debounce";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/command";
import { ScrollArea } from "@repo/ui/scroll-area";

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
    q: debounceValue.length == 0 ? props.defaultValue : "",
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
          <CommandEmpty>{t("not_found")}</CommandEmpty>
          <ScrollArea className="h-[400px] w-full">
            <CommandGroup heading={t("main_menu")}></CommandGroup>
            <CommandSeparator />
            {studentsQuery.data?.map((student) => (
              <CommandItem
                key={student.id}
                onSelect={() => runCommand(student.id, getFullName(student))}
              >
                {getFullName(student)}
              </CommandItem>
            ))}
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
}
