/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Settings2Icon, WandSparkles } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";

import type { AppreciationCategory } from "~/types/appreciation";
import { useLocale } from "~/i18n";
import { AppreciationList } from "./AppreciationList";
import { CreateEditAppreciationCategory } from "./CreateEditAppreciationCategory";

export function AppreciationCategoryList({
  categories,
  studentId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  studentId: string;
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<AppreciationCategory | null>(null);

  const [addClicked, setAddClicked] = useState<boolean>(false);

  const [openIdItem, setOpenIdItem] = useState<number | null>(null);

  const { t } = useLocale();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <WandSparkles className="h-4 w-4 stroke-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[350px] p-0 text-sm">
        {!selectedCategory ? (
          <div className="p-1">
            {categories.map((category) => {
              return (
                <Fragment key={`category-${category.id}`}>
                  {category.id == openIdItem ? (
                    <CreateEditAppreciationCategory
                      onCompleted={() => {
                        setOpenIdItem(null);
                      }}
                      category={category}
                    />
                  ) : (
                    <div
                      className="group/category hover:bg-secondary hover:text-secondary-foreground flex w-full items-center justify-between rounded-md px-2 py-1"
                      key={`category-${category.id}`}
                    >
                      <span
                        className="cursor-pointer overflow-hidden text-left overflow-ellipsis whitespace-nowrap hover:underline"
                        onClick={() => {
                          setSelectedCategory(category);
                        }}
                      >
                        {category.name}
                      </span>

                      <motion.button
                        layout
                        onClick={() => {
                          setOpenIdItem(category.id);
                        }}
                        className="hover:text-muted-foreground h-4 w-4 opacity-0 group-hover/category:opacity-100"
                      >
                        <motion.span
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{
                            type: "spring",
                            duration: 0.95,
                          }}
                        >
                          <Settings2Icon className="h-5 w-5 stroke-1 hover:stroke-[#13EFFB]/70" />
                        </motion.span>
                      </motion.button>
                    </div>
                  )}
                </Fragment>
              );
            })}
            <Separator />
            {addClicked && (
              <CreateEditAppreciationCategory
                onCompleted={() => {
                  setAddClicked(false);
                }}
              />
            )}
            <div
              onClick={() => {
                setAddClicked(true);
              }}
              className="hover:bg-muted my-1 flex cursor-pointer flex-row items-center gap-2 rounded-md p-1"
            >
              <PlusCircle className="h-5 w-5 stroke-1" />
              {t("add")}
            </div>
          </div>
        ) : (
          <AppreciationList
            studentId={studentId}
            setSelectedCategoryAction={setSelectedCategory}
            category={selectedCategory}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
