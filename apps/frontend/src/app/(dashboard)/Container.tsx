"use client";

import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useRightPanel } from "./RightPanelProvider";

export function Container(props: PropsWithChildren) {
  const { isOpen, content } = useRightPanel();
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* flex-row split: main content + optional right panel */}
      <div className="flex flex-1 min-h-0">
        <div className="@container/main flex flex-1 min-h-0 flex-col gap-2">
          {props.children}
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="meta-panel"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="hidden lg:flex lg:flex-col w-80 flex-none border-l border-border"
            >
              {content ?? "Right pannel"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
