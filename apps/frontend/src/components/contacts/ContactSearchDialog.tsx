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

export interface SearchedContact {
  id: string;
  lastName: string | null;
  firstName: string | null;
  userId: string | null;
}

interface SearchDialogProps {
  onSelect: (value: SearchedContact) => void;
  placeholder?: string;
}

export function ContactSearchDialog({
  onSelect,
  placeholder = "Rechercher un contact...",
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [debounceValue] = useDebounce(query, 500);
  const trpc = useTRPC();
  const { closeModal } = useModal();

  const contactsQuery = useQuery(
    trpc.contact.all.queryOptions({ query: debounceValue }),
  );

  const handleSuggestionClick = (
    contact: RouterOutputs["contact"]["all"][number],
  ) => {
    onSelect({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      userId: contact.userId,
    });
    closeModal();
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <InputGroup>
        <InputGroupInput
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="h-[200px] overflow-y-auto rounded-md border">
        {contactsQuery.isPending ? (
          <div className="flex h-full flex-shrink-0 items-center justify-center">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (contactsQuery.data ?? []).length > 0 ? (
          <ul className="divide-y">
            {contactsQuery.data?.map((contact) => (
              <li
                key={contact.id}
                className="hover:bg-muted cursor-pointer px-4 py-3 transition-colors"
                onClick={() => handleSuggestionClick(contact)}
              >
                <div className="font-medium">{getFullName(contact)}</div>
                {contact.phoneNumber1 && (
                  <div className="text-muted-foreground text-xs">
                    {contact.phoneNumber1}
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
