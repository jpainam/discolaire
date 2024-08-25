import { Loader } from "lucide-react";

import { cn } from "~/lib/utils";

export function CircularLoader({ className }: { className?: string }) {
  return (
    <div className="flex h-[100px] w-full items-center justify-center">
      <Loader className={cn("h-[40px] w-[40px] animate-spin", className)} />
    </div>
  );
}
