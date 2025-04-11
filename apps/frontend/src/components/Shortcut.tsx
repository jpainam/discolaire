"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import {
  BookmarkPlus,
  Edit2,
  Loader2Icon,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { env } from "~/env";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { SimpleTooltip } from "./simple-tooltip";

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
    })
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
    })
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
    })
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
    })
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

  const { t } = useLocale();

  const shortcuts = shortcutsQuery.data ?? [];
  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <SimpleTooltip content={t("manage_shortcuts")}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="size-8">
              <BookmarkPlus className="h-4 w-4" />
              <span className="sr-only">{t("shortcuts")}</span>
            </Button>
          </PopoverTrigger>
        </SimpleTooltip>
        <PopoverContent className="w-96 p-0" align="end">
          {shortcutsQuery.isPending ? (
            <div className="flex justify-center items-center w-32">
              <Loader2Icon className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4">
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
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => debounced("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[300px] px-4">
                {shortcuts.length > 0 ? (
                  <ul className="space-y-2 pb-4">
                    {shortcuts.map((shortcut) => (
                      <li
                        key={shortcut.id}
                        className="group flex items-center justify-between rounded-md py-2 hover:bg-muted"
                      >
                        <a
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="truncate w-72 text-sm"
                          target="_blank"
                          href={shortcut.url}
                        >
                          {shortcut.title}
                          <span className="block truncate text-muted-foreground text-xs w-72">
                            {shortcut.url}
                          </span>
                        </a>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            className="h-4 w-4 text-destructive hover:text-destructive/90"
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
                    <p className="text-sm text-muted-foreground">
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
