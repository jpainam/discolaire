"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import type { RouterOutputs } from "@repo/api";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export interface SearchedStaff {
  id: string;
  lastName: string | null;
  firstName: string | null;
  userId: string | null;
}

interface SearchDialogProps {
  onSelect: (value: SearchedStaff) => void;
  placeholder?: string;
}

export function StaffSearchDialog({
  onSelect,
  placeholder = "Rechercher un personnel...",
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [debounceValue] = useDebounce(query, 500);
  const trpc = useTRPC();
  const { closeModal } = useModal();

  const staffQuery = useQuery(
    trpc.staff.all.queryOptions({ query: debounceValue }),
  );

  const handleSuggestionClick = (
    staff: RouterOutputs["staff"]["all"][number],
  ) => {
    onSelect({
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      userId: staff.userId,
    });
    closeModal();
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <InputGroup>
        <InputGroupInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder={placeholder}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="h-[200px] overflow-y-auto rounded-md border">
        {staffQuery.isPending ? (
          <div className="flex h-full flex-shrink-0 items-center justify-center">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (staffQuery.data ?? []).length > 0 ? (
          <ul className="divide-y">
            {staffQuery.data?.map((staff) => (
              <li
                key={staff.id}
                className="hover:bg-muted cursor-pointer px-4 py-3 transition-colors"
                onClick={() => handleSuggestionClick(staff)}
              >
                <div className="font-medium">{getFullName(staff)}</div>
                {staff.jobTitle && (
                  <div className="text-muted-foreground text-xs">
                    {staff.jobTitle}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : query.length > 1 ? (
          <div className="text-muted-foreground flex h-full flex-shrink-0 items-center justify-center">
            Aucun résultat trouvé
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full flex-shrink-0 items-center justify-center">
            Tapez pour rechercher
          </div>
        )}
      </div>
    </div>
  );
}
