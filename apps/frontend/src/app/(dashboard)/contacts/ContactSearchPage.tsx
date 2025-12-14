"use client";

import { useState } from "react";
import Link from "next/link";
import { MailIcon, PhoneIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { searchContacts } from "~/actions/search";
import { AvatarState } from "~/components/AvatarState";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { getFullName } from "~/utils";

export function ContactSearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations();
  const [searchResults, setSearchResults] = useState<
    RouterOutputs["contact"]["all"]
  >([]);
  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchContacts({
      q: searchQuery,
    });

    setSearchResults(results);
    setIsSearching(false);
  };
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex max-w-4xl flex-row items-center gap-4">
        <InputGroup className="flex-1">
          <InputGroupInput
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
        </InputGroup>

        <Button
          disabled={isSearching}
          isLoading={isSearching}
          onClick={handleSearch}
          size={"sm"}
        >
          {t("search")}
        </Button>
      </div>

      {searchResults.length === 0 ? (
        <div className="py-12 text-center text-sm">
          <Search className="mx-auto h-12 w-12" />
          <h3 className="mt-4">{t("Search for contacts")}</h3>
          <p className="text-muted-foreground mt-2 text-xs">{t("search")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 text-xs">
          {searchResults.map((contact) => (
            <div key={contact.id} className="p-0">
              <div className="flex flex-row items-center justify-between rounded-xl border px-4 py-2 shadow-sm">
                <AvatarState
                  className="h-10 w-10"
                  avatar={contact.user?.avatar}
                />
                <div className="ml-4 flex flex-1 flex-col gap-2">
                  <Link
                    className="hover:underline"
                    href={`/contacts/${contact.id}`}
                  >
                    {getFullName(contact)}
                  </Link>
                  <div className="flex flex-row items-center gap-2">
                    {contact.user?.email && (
                      <div className="text-muted-foreground">
                        <MailIcon className="mr-1 inline h-4 w-4" />
                        {contact.user.email}
                      </div>
                    )}

                    <p className="text-muted-foreground flex flex-row items-center gap-2">
                      <PhoneIcon className="inline h-3 w-3" />
                      <span>{contact.phoneNumber1}</span> /{" "}
                      <span>{contact.phoneNumber2}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
