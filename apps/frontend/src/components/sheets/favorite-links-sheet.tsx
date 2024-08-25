"use client";

import { Fragment, useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet";
import { Star } from "lucide-react";

import { SortableList } from "../dnd/dnd-sortable-list";

type ItemType = {
  id: string;
  label: string;
  value: string;
};

const favorites: ItemType[] = [
  { id: "item1", label: "Item 1", value: "Value 1" },
  { id: "item2", label: "Item 2", value: "Value 2" },
  { label: "Item 3", value: "Value 3", id: "item3" },
  { id: "item4", label: "Item 4", value: "Value 4" },
  { id: "item5", label: "Item 5", value: "Value 5" },
  { id: "item6", label: "Item 6", value: "Value 6" },
  { id: "item7", label: "Item 7", value: "Value 7" },
  { id: "item8", label: "Item 8", value: "Value 8" },
];
export function FavoriteLinksSheet() {
  const [items, setItems] = useState<ItemType[]>(favorites);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} aria-label="Notification" variant="ghost">
          <Star className="fill-yellow-400" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mes favories</SheetTitle>
          <SheetDescription>
            Modifier et grouper vos liens favoris pour un accès rapide
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <ul>
            <SortableList items={items} onChange={setItems}>
              {items.map((item, index) => {
                return (
                  <Fragment key={"sortable-menu" + item.id + "-" + index}>
                    <SortableList.Item id={item.id}>
                      <div className="flex items-center bg-gray-500 p-5 text-lg font-bold">
                        <SortableList.DragHandle />
                        {item.label}
                      </div>
                    </SortableList.Item>
                  </Fragment>
                );
              })}
            </SortableList>
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
