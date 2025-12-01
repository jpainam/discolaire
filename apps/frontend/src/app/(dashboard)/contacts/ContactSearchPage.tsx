"use client";

import { useState } from "react";
import Link from "next/link";
import { MailIcon, PhoneIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { searchContacts } from "~/actions/search";
import { AvatarState } from "~/components/AvatarState";
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
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder={t("Enter a name, ID, or email to get started")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            //onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
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
          <p className="text-muted-foreground mt-2 text-xs">
            {t("Enter a name, ID, or email to get started")}
          </p>
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
