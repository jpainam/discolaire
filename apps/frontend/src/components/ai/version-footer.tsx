/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";

import { useState } from "react";
import { isAfter } from "date-fns";
import { motion } from "framer-motion";
import { useSWRConfig } from "swr";
import { useWindowSize } from "usehooks-ts";

import type { AiDocument } from "@repo/db";
import { Button } from "@repo/ui/components/button";

import { useArtifact } from "~/hooks/use-artifact";
import { getDocumentTimestampByIndex } from "~/lib/utils";
import { LoaderIcon } from "./icons";

interface VersionFooterProps {
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
  documents: AiDocument[] | undefined;
  currentVersionIndex: number;
}

export const VersionFooter = ({
  handleVersionChange,
  documents,
  currentVersionIndex,
}: VersionFooterProps) => {
  const { artifact } = useArtifact();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);

  if (!documents) return;

  return (
    <motion.div
      className="bg-background absolute bottom-0 z-50 flex w-full flex-col justify-between gap-4 border-t p-4 lg:flex-row"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
    >
      <div>
        <div>You are viewing a previous version</div>
        <div className="text-muted-foreground text-sm">
          Restore this version to make edits
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            setIsMutating(true);

            await mutate(
              `/api/ai/document?id=${artifact.documentId}`,
              await fetch(
                `/api/ai/document?id=${artifact.documentId}&timestamp=${getDocumentTimestampByIndex(
                  documents,
                  currentVersionIndex,
                )}`,
                {
                  method: "DELETE",
                },
              ),
              {
                optimisticData: documents
                  ? [
                      ...documents.filter((document) =>
                        isAfter(
                          new Date(document.createdAt),
                          new Date(
                            getDocumentTimestampByIndex(
                              documents,
                              currentVersionIndex,
                            ),
                          ),
                        ),
                      ),
                    ]
                  : [],
              },
            );
          }}
        >
          <div>Restore this version</div>
          {isMutating && (
            <div className="animate-spin">
              <LoaderIcon />
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleVersionChange("latest");
          }}
        >
          Back to latest version
        </Button>
      </div>
    </motion.div>
  );
};
