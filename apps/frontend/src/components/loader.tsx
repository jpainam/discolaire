import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export function CircularLoader({ className }: { className?: string }) {
  return (
    <div className="flex w-full h-[100px] justify-center items-center">
      <Loader className={cn("h-[40px] w-[40px] animate-spin", className)} />
    </div>
  );
}
