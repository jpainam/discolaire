"use client";

import type { RouterOutputs } from "@repo/api";
import { Input } from "@repo/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

interface SearchedStudent {
  id: string;
  lastName: string | null;
  firstName: string | null;
}

interface SearchDialogProps {
  onSelect: (value: SearchedStudent) => void;
  placeholder?: string;
  triggerLabel?: string;
}

export function StudentSearchDialog({
  onSelect,
  placeholder = "Search for something...",
}: SearchDialogProps) {
  const [query, setQuery] = useState("");

  const [debounceValue] = useDebounce(query, 500);

  const trpc = useTRPC();

  const studentsQuery = useQuery(
    trpc.student.search.queryOptions({
      query: debounceValue,
    }),
  );

  const { closeModal } = useModal();

  const handleSuggestionClick = (
    student: RouterOutputs["student"]["search"][number],
  ) => {
    onSelect({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
    });
    closeModal();
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="h-[200px] rounded-md border overflow-y-auto">
        {studentsQuery.isPending ? (
          <div className="flex h-full items-center justify-center flex-shrink-0">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (studentsQuery.data ?? []).length > 0 ? (
          <ul className="divide-y">
            {studentsQuery.data?.map((student) => (
              <li
                key={student.id}
                className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(student)}
              >
                {getFullName(student)}
              </li>
            ))}
          </ul>
        ) : query.length > 1 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground flex-shrink-0">
            No results found
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground flex-shrink-0">
            Type to search
          </div>
        )}
      </div>
    </div>
  );
}
