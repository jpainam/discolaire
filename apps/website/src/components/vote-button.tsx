"use client";

import { ChevronUp } from "lucide-react";
import { useOptimisticAction } from "next-safe-action/hooks";

import { Button } from "@repo/ui/button";

import { voteAction } from "~/actions/vote-action";

type Props = {
  id: string;
  count: number;
};

export function VoteButton({ count, id }: Props) {
  const { execute, optimisticState } = useOptimisticAction(voteAction, {
    currentState: count,
    updateFn: () => {
      return +count + 1;
    },
  });

  return (
    <Button
      variant="outline"
      className="h-16 w-14 flex-col p-6"
      onClick={() => execute({ id })}
    >
      <div className="flex flex-col items-center space-x-2">
        <ChevronUp size={16} />
        {optimisticState}
      </div>
    </Button>
  );
}
