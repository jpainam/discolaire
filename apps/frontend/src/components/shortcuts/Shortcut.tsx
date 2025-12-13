"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookmarkPlus,
  Edit2,
  Loader2Icon,
  NotebookPen,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { SidebarMenuButton, useSidebar } from "~/components/ui/sidebar";
import { env } from "~/env";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { CreateGradesheetShortcut } from "./CreateGradesheetShortcut";

type Shortcut = RouterOutputs["shortcut"]["search"][number];

export function Shortcut() {
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebouncedCallback((value: string) => {
    void setSearchQuery(value);
  }, 1000);
  const pathname = usePathname();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const shortcutsQuery = useQuery(
    trpc.shortcut.search.queryOptions({
      query: searchQuery,
    }),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

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
  const updateShortcut = useMutation(
    trpc.shortcut.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.shortcut.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );

  const addCurrentPageToShortcuts = () => {
    const newShortcut = {
      title: document.title,
      url:
        pathname === "/"
          ? env.NEXT_PUBLIC_BASE_URL
          : env.NEXT_PUBLIC_BASE_URL + pathname,
    };
    addShortcut.mutate(newShortcut);
  };

  const openEditDialog = (shortcut: Shortcut) => {
    setCurrentShortcut(shortcut);
    setEditTitle(shortcut.title);
    setEditUrl(shortcut.url);
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!currentShortcut) return;
    toast.loading(t("updating"), { id: 0 });
    updateShortcut.mutate({
      id: currentShortcut.id,
      title: editTitle,
      url: editUrl,
    });

    setIsEditDialogOpen(false);
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
            <button className="flex flex-row items-center gap-2">
              <BookmarkPlus className="h-4 w-4" />
              <span>{t("shortcuts")}</span>
            </button>
          </PopoverTrigger>
        ) : (
          <PopoverTrigger asChild>
            <SidebarMenuButton>
              <BookmarkPlus className="h-4 w-4" />
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
              <div className="flex items-center justify-between px-4 py-1.5">
                <h3 className="font-medium">{t("shortcuts")}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={addCurrentPageToShortcuts}
                >
                  <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
                  {t("add_current_page")}
                </Button>
              </div>
              <Separator />
              <div className="p-4">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder={t("search") + "..."}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => debounced(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7"
                      onClick={() => debounced("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[300px] px-4">
                <div className="flex flex-col gap-2">
                  <Button
                    size={"sm"}
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
                  <ul className="space-y-2 pb-4">
                    {shortcuts.map((shortcut) => (
                      <li
                        key={shortcut.id}
                        className="group hover:bg-muted flex items-center justify-between rounded-md py-2"
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
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => openEditDialog(shortcut)}
                          >
                            <Edit2 className="h-3 w-3" />
                            <span className="sr-only">{t("edit")}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90 h-4 w-4"
                            onClick={() => {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteShortcut.mutate(shortcut.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("edit_shortcut")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                {t("title")}
              </Label>
              <Input
                id="title"
                value={editTitle}
                required={true}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url" className="text-sm font-medium">
                URL
              </Label>
              <Input
                id="url"
                required={true}
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button onClick={saveEdit}>{t("submit")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
