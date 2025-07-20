"use client";

import Image from "next/image";

import { SidebarHeader } from "@repo/ui/components/sidebar";

import { SearchForm } from "./search-form";

export function AppHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center px-2 pt-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          {/* <GalleryVerticalEnd className="h-4 w-4" /> */}
          <Image alt="logo" src={"/images/logo.png"} width={100} height={100} />
        </div>

        <div className="ml-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
          Discolaire
        </div>
      </div>
      <SearchForm />
    </SidebarHeader>
  );
}
