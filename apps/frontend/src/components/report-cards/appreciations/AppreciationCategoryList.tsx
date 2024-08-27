"use client";

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Settings2Icon, WandSparkles } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Separator } from "@repo/ui/separator";

import type { AppreciationCategory } from "~/types/appreciation";
import { AppreciationList } from "./AppreciationList";
import { CreateEditAppreciationCategory } from "./CreateEditAppreciationCategory";

export function AppreciationCategoryList({
  categories,
  studentId,
}: {
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
                      className="group/category flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-secondary hover:text-secondary-foreground"
                      key={`category-${category.id}`}
                    >
                      <span
                        className="cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap text-left hover:underline"
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
                        className="h-4 w-4 opacity-0 hover:text-muted-foreground group-hover/category:opacity-100"
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
              className="my-1 flex cursor-pointer flex-row items-center gap-2 rounded-md p-1 hover:bg-muted"
            >
              <PlusCircle className="h-5 w-5 stroke-1" />
              {t("add")}
            </div>
          </div>
        ) : (
          <AppreciationList
            studentId={studentId}
            setSelectedCategory={setSelectedCategory}
            category={selectedCategory}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
