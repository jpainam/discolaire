"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowDownIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ClassroomStudentSelector({
  classroomId,
  onSelectAction,
  className,
}: {
  classroomId: string;
  className?: string;
  onSelectAction: (val: string | null) => void;
}) {
  const trpc = useTRPC();
  const studentQuery = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const t = useTranslations();
  const [value, setValue] = useState<string | null>();
  const [open, setOpen] = useState(false);
  if (studentQuery.isPending) {
    return <Skeleton className="h-8 w-full" />;
  }
  const selected = studentQuery.data?.find(
    (classroom) => classroom.id === value,
  );
  const students = studentQuery.data;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between truncate font-normal",
            className,
          )}
          variant="outline"
        >
          {selected ? getFullName(selected) : "Selectionné un élève"}
          <ArrowDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command
          filter={(value, search) => {
            const item = students?.find((it) => it.id === value);
            if (
              getFullName(item).toLowerCase().includes(search.toLowerCase())
            ) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("no_data")}</CommandEmpty>
            <CommandGroup>
              {students?.map((st, index) => {
                return (
                  <CommandItem
                    key={`${st.id}-${index}`}
                    value={st.id.toString()}
                    onSelect={(_value) => {
                      setValue(st.id === value ? "" : st.id);
                      onSelectAction(st.id === value ? null : st.id);
                      setOpen(false);
                    }}
                  >
                    {getFullName(st)}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === st.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
