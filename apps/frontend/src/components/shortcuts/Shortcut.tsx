"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, NotebookPen, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SidebarMenuButton, useSidebar } from "~/components/ui/sidebar";
import { useModal } from "~/hooks/use-modal";
import { BookmarkIcon, DeleteIcon, EditIcon, PlusIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { CreateEditShortcut } from "./CreateEditShortcut";
import { CreateGradesheetShortcut } from "./CreateGradesheetShortcut";

type Shortcut = RouterOutputs["shortcut"]["search"][number];

export function Shortcut() {
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebouncedCallback((value: string) => {
    void setSearchQuery(value);
  }, 500);
  const pathname = usePathname();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const shortcutsQuery = useQuery(
    trpc.shortcut.search.queryOptions({
      query: searchQuery,
    }),
  );

  const [isOpen, setIsOpen] = useState(false);

  const addShortcut = useMutation(
    trpc.shortcut.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.shortcut.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
      },
    }),
  );
  const deleteShortcut = useMutation(
    trpc.shortcut.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.shortcut.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const addCurrentPageToShortcuts = () => {
    const baseUrl = window.location.origin;
    const newShortcut = {
      title: document.title,
      url:
        pathname === "/" ? baseUrl : new URL(pathname, baseUrl).toString(),
    };
    addShortcut.mutate(newShortcut);
  };

  const t = useTranslations();
  const { isMobile } = useSidebar();

  const shortcuts = shortcutsQuery.data ?? [];
  const { openModal } = useModal();
  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {isMobile ? (
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"sm"}>
              <BookmarkIcon />
              <span>{t("shortcuts")}</span>
            </Button>
          </PopoverTrigger>
        ) : (
          <PopoverTrigger asChild>
            <SidebarMenuButton>
              <BookmarkIcon />
              <span>{t("shortcuts")}</span>
            </SidebarMenuButton>
          </PopoverTrigger>
        )}
        <PopoverContent className="w-96 p-0" align="start">
          {shortcutsQuery.isPending ? (
            <div className="flex w-32 items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b p-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <BookmarkIcon className="size-3" />
                  {t("shortcuts")}
                </div>
                <Button
                  size={"xs"}
                  variant="ghost"
                  onClick={addCurrentPageToShortcuts}
                >
                  <PlusIcon />
                  {t("add_current_page")}
                </Button>
              </div>
              <div className="px-2">
                <InputGroup>
                  <InputGroupInput
                    onChange={(e) => debounced(e.target.value)}
                    placeholder={t("search")}
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <ScrollArea className="h-[300px] px-2">
                <div className="flex flex-col items-start gap-2">
                  <Button
                    size={"sm"}
                    variant={"link"}
                    onClick={() => {
                      openModal({
                        title: "Saisie de note - raccourcis",
                        description: "Choisir les options et valider",
                        view: <CreateGradesheetShortcut />,
                      });
                    }}
                  >
                    <NotebookPen />
                    Saisie de notes
                  </Button>
                </div>
                {shortcuts.length > 0 ? (
                  <ul className="">
                    {shortcuts.map((shortcut) => (
                      <li
                        key={shortcut.id}
                        className="group hover:bg-muted flex items-center justify-between rounded-md p-2"
                      >
                        <a
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="w-72 truncate text-sm"
                          target="_blank"
                          href={shortcut.url}
                        >
                          {shortcut.title}
                          <span className="text-muted-foreground block w-72 truncate text-xs">
                            {shortcut.url}
                          </span>
                        </a>
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              openModal({
                                title: t("edit_shortcut"),
                                view: (
                                  <CreateEditShortcut shortcut={shortcut} />
                                ),
                              });
                            }}
                          >
                            <EditIcon />
                            <span className="sr-only">{t("edit")}</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteShortcut.mutate(shortcut.id);
                            }}
                          >
                            <DeleteIcon />
                            <span className="sr-only">{t("delete")}</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      {searchQuery
                        ? t("no_shortcuts_found")
                        : t("no_shortcuts_yet")}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
