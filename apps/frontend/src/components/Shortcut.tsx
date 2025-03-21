"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { BookmarkPlus, Edit2, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useLocale } from "~/i18n";
import { SimpleTooltip } from "./simple-tooltip";

interface Shortcut {
  id: string;
  title: string;
  url: string;
}

export function Shortcut() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { id: "1", title: "Vercel Dashboard", url: "https://vercel.com/dashboard" },
    { id: "2", title: "GitHub", url: "https://github.com" },
    { id: "3", title: "Next.js Documentation", url: "https://nextjs.org/docs" },
    { id: "4", title: "React Documentation", url: "https://react.dev" },
    { id: "5", title: "Tailwind CSS", url: "https://tailwindcss.com" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Current page URL (in a real app, this would come from the browser)
  const currentUrl = "https://example.com/current-page";
  const currentTitle = "Current Page Title";

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCurrentPageToShortcuts = () => {
    const newShortcut = {
      id: Date.now().toString(),
      title: currentTitle,
      url: currentUrl,
    };
    setShortcuts([...shortcuts, newShortcut]);
  };

  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
  };

  const openEditDialog = (shortcut: Shortcut) => {
    setCurrentShortcut(shortcut);
    setEditTitle(shortcut.title);
    setEditUrl(shortcut.url);
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!currentShortcut) return;

    setShortcuts(
      shortcuts.map((shortcut) =>
        shortcut.id === currentShortcut.id
          ? { ...shortcut, title: editTitle, url: editUrl }
          : shortcut
      )
    );
    setIsEditDialogOpen(false);
  };

  const { t } = useLocale();
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
                placeholder="Search shortcuts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-[300px] px-4">
            {filteredShortcuts.length > 0 ? (
              <ul className="space-y-2 pb-4">
                {filteredShortcuts.map((shortcut) => (
                  <li
                    key={shortcut.id}
                    className="group flex items-center justify-between rounded-md p-2 hover:bg-muted"
                  >
                    <a
                      href={shortcut.url}
                      className="flex-1 truncate text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      {shortcut.title}
                      <span className="block text-xs text-muted-foreground truncate">
                        {shortcut.url}
                      </span>
                    </a>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditDialog(shortcut)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => deleteShortcut(shortcut.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
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
        </PopoverContent>
      </Popover>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shortcut</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
