"use client";

import { Badge } from "~/components/ui/badge";

export function SuccessProbability() {
  return (
    <Badge
      variant={"outline"}
      className="bg-pink-600 text-white dark:bg-pink-600"
    >
      50%
    </Badge>
  );
}
