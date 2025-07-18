"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { MailIcon, PhoneIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { searchContacts } from "~/actions/search";
import { AvatarState } from "~/components/AvatarState";
import { useLocale } from "~/i18n";
import { getFullName } from "~/utils";
export function ContactSearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLocale();
  const [searchResults, setSearchResults] = useState<
    RouterOutputs["contact"]["search"]
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
    <div className="px-4 py-2 gap-2 flex flex-col ">
      <div className="flex items-center flex-row gap-4 max-w-4xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("Enter a name, ID, or email to get started.")}
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
        <div className="text-center text-sm py-12">
          <Search className="mx-auto h-12 w-12 " />
          <h3 className="mt-4">{t("Search for contacts")}</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("Enter a name, ID, or email to get started.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 text-xs gap-2">
          {searchResults.map((contact) => (
            <div key={contact.id} className="p-0">
              <div className="border rounded-xl shadow-sm px-4 flex flex-row items-center justify-between py-2">
                <AvatarState
                  className="h-10 w-10"
                  avatar={contact.user?.avatar}
                />
                <div className="flex-1 ml-4 flex flex-col gap-2">
                  <Link
                    className=" hover:underline"
                    href={`/contacts/${contact.id}`}
                  >
                    {getFullName(contact)}
                  </Link>
                  <div className="flex flex-row items-center gap-2">
                    {contact.user?.email && (
                      <div className="text-muted-foreground">
                        <MailIcon className="inline h-4 w-4 mr-1" />
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
