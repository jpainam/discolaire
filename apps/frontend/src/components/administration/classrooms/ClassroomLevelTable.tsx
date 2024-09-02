"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Settings2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/button";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

import type { Item } from "./sortable-list";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { SortableList, SortableListItem } from "./sortable-list";

export function ClassroomLevelTable() {
  const classroomLevelsQuery = api.classroomLevel.all.useQuery();

  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    if (!classroomLevelsQuery.data) return;
    const data = classroomLevelsQuery.data;
    setItems(
      data.map((item) => ({
        name: item.name,
        checked: false,
        id: item.id,
      })),
    );
  }, [classroomLevelsQuery.data]);

  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const updateClassroomLevelMutation = api.classroomLevel.update.useMutation({
    onSettled: () => api.useUtils().classroomLevel.all.invalidate(),
  });

  const handleCompleteItem = (id: number) => {
    //toast.promise(updateClassroomLevelMutation.mutateAsync(), {});
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleCloseOnDrag = useCallback(() => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.checked ? { ...item, checked: false } : item,
      );
      return updatedItems.some(
        (item, index) => item.checked !== prevItems[index].checked,
      )
        ? updatedItems
        : prevItems;
    });
  }, []);

  const renderListItem = (
    item: Item,
    order: number,
    onCompleteItem: (id: number) => void,
    onRemoveItem: (id: number) => void,
  ) => {
    const isOpen = item.id === openItemId;

    // const tabs = [
    //   {
    //     id: 0,
    //     label: "Title",
    //     content: (

    //     ),
    //   },
    // ];

    return (
      <SortableListItem
        item={item}
        order={order}
        key={item.id}
        isExpanded={isOpen}
        onCompleteItem={onCompleteItem}
        onRemoveItem={onRemoveItem}
        handleDrag={handleCloseOnDrag}
        className="my-2"
        renderExtra={(item) => (
          <div
            key={`${isOpen}`}
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-2",
              isOpen ? "px-1 py-1" : "py-3",
            )}
          >
            <motion.button
              layout
              onClick={() => setOpenItemId(!isOpen ? item.id : null)}
              key="collapse"
              className={cn(
                isOpen
                  ? "absolute right-3 top-3 z-10"
                  : "relative z-10 ml-auto mr-3",
              )}
            >
              {isOpen ? (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 1.95,
                  }}
                >
                  <XIcon className="h-5 w-5 text-neutral-500" />
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    duration: 0.95,
                  }}
                >
                  <Settings2Icon className="h-4 w-4 stroke-1 text-secondary-foreground hover:stroke-primary" />
                </motion.span>
              )}
            </motion.button>

            <LayoutGroup id={`${item.id}`}>
              <AnimatePresence mode="popLayout">
                {isOpen ? (
                  <motion.div className="flex w-full flex-col">
                    <motion.div
                      initial={{
                        y: 0,
                        opacity: 0,
                        filter: "blur(4px)",
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                      }}
                      transition={{
                        type: "spring",
                        duration: 0.15,
                      }}
                      layout
                      className="w-full"
                    >
                      <div className="flex w-full flex-col py-2 pr-2">
                        <motion.div
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.75,
                            delay: 0.15,
                          }}
                        >
                          <Label className="text-xs">Name</Label>
                          <Input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              const text = e.target.value;
                              setItems((prevItems) =>
                                prevItems.map((i) =>
                                  i.id === item.id ? { ...i, text } : i,
                                ),
                              );
                            }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      key={`re-render-${item.id}`} //  re-animates the button section on tab change
                      className="mb-2 flex w-full items-center justify-between pl-2"
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.55,
                      }}
                    >
                      <motion.div layout className="ml-auto mr-1 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setOpenItemId(null);
                            toast.info("Changes saved");
                          }}
                          className="h-7"
                        >
                          Apply Changes
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        )}
      />
    );
  };

  if (classroomLevelsQuery.isPending) {
    return (
      <DataTableSkeleton
        showViewOptions={false}
        rowCount={10}
        columnCount={2}
        withPagination={false}
      />
    );
  }
  return (
    <SortableList
      items={items}
      setItems={setItems}
      onCompleteItem={handleCompleteItem}
      renderItem={renderListItem}
    />
  );
}
