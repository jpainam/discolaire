import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@repo/ui/components/button";

import { useArtifactSelector } from "~/hooks/use-artifact";
import { cn } from "~/lib/utils";
import { CrossSmallIcon, LoaderIcon, TerminalWindowIcon } from "./icons";

export interface ConsoleOutputContent {
  type: "text" | "image";
  value: string;
}

export interface ConsoleOutput {
  id: string;
  status: "in_progress" | "loading_packages" | "completed" | "failed";
  contents: ConsoleOutputContent[];
}

interface ConsoleProps {
  consoleOutputs: ConsoleOutput[];
  setConsoleOutputs: Dispatch<SetStateAction<ConsoleOutput[]>>;
}

export function Console({ consoleOutputs, setConsoleOutputs }: ConsoleProps) {
  const [height, setHeight] = useState<number>(300);
  const [isResizing, setIsResizing] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  const minHeight = 100;
  const maxHeight = 800;

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setHeight(newHeight);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleOutputs]);

  useEffect(() => {
    if (!isArtifactVisible) {
      setConsoleOutputs([]);
    }
  }, [isArtifactVisible, setConsoleOutputs]);

  return consoleOutputs.length > 0 ? (
    <>
      <div
        className="fixed z-50 h-2 w-full cursor-ns-resize"
        onMouseDown={startResizing}
        style={{ bottom: height - 4 }}
        role="slider"
        aria-valuenow={minHeight}
      />

      <div
        className={cn(
          "fixed bottom-0 z-40 flex w-full flex-col overflow-x-hidden overflow-y-scroll border-t border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900",
          {
            "select-none": isResizing,
          },
        )}
        style={{ height }}
      >
        <div className="bg-muted sticky top-0 z-50 flex h-fit w-full flex-row items-center justify-between border-b border-zinc-200 px-2 py-1 dark:border-zinc-700">
          <div className="flex flex-row items-center gap-3 pl-2 text-sm text-zinc-800 dark:text-zinc-50">
            <div className="text-muted-foreground">
              <TerminalWindowIcon />
            </div>
            <div>Console</div>
          </div>
          <Button
            variant="ghost"
            className="size-fit p-1 hover:bg-zinc-200 hover:dark:bg-zinc-700"
            size="icon"
            onClick={() => setConsoleOutputs([])}
          >
            <CrossSmallIcon />
          </Button>
        </div>

        <div>
          {consoleOutputs.map((consoleOutput, index) => (
            <div
              key={consoleOutput.id}
              className="flex flex-row border-b border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div
                className={cn("w-12 shrink-0", {
                  "text-muted-foreground": [
                    "in_progress",
                    "loading_packages",
                  ].includes(consoleOutput.status),
                  "text-emerald-500": consoleOutput.status === "completed",
                  "text-red-400": consoleOutput.status === "failed",
                })}
              >
                [{index + 1}]
              </div>
              {["in_progress", "loading_packages"].includes(
                consoleOutput.status,
              ) ? (
                <div className="flex flex-row gap-2">
                  <div className="mt-0.5 mb-auto size-fit animate-spin self-center">
                    <LoaderIcon />
                  </div>
                  <div className="text-muted-foreground">
                    {consoleOutput.status === "in_progress"
                      ? "Initializing..."
                      : consoleOutput.status === "loading_packages"
                        ? consoleOutput.contents.map((content) =>
                            content.type === "text" ? content.value : null,
                          )
                        : null}
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-2 overflow-x-scroll text-zinc-900 dark:text-zinc-50">
                  {consoleOutput.contents.map((content, index) =>
                    content.type === "image" ? (
                      <picture key={`${consoleOutput.id}-${index}`}>
                        <img
                          src={content.value}
                          alt="output"
                          className="max-w-screen-toast-mobile w-full rounded-md"
                        />
                      </picture>
                    ) : (
                      <div
                        key={`${consoleOutput.id}-${index}`}
                        className="w-full break-words whitespace-pre-line"
                      >
                        {content.value}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </>
  ) : null;
}
