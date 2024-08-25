"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/button";

export function ThemeSelector() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className={cn(theme === "zinc" && "border-zinc-950")}
        onClick={() => setTheme("zinc")}
      >
        <div className="aspect-square w-5 rounded-sm bg-zinc-950" />
        <span className="sr-only">Zinc</span>
      </Button>
      <Button
        size="icon"
        variant="outline"
        className={cn("h-7 w-7", theme === "orange" && "border-orange-400")}
        onClick={() => setTheme("orange")}
      >
        <div className="aspect-square w-5 rounded-sm bg-orange-400" />
        <span className="sr-only">Orange</span>
      </Button>
      <Button
        size="icon"
        variant="outline"
        className={cn("h-7 w-7", theme === "green" && "border-green-600")}
        onClick={() => setTheme("green")}
      >
        <div className="aspect-square w-5 rounded-sm bg-green-600" />
        <span className="sr-only">Orange</span>
      </Button>
    </div>
  );
}
