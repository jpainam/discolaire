import { cn } from "@/lib/utils";
import { ToggleGroup } from "@repo/ui/ToggleGroup";
import { PiGridFour, PiListBullets } from "react-icons/pi";

export function ViewSwitcher() {
  const isGridLayout = true;
  const options = [
    {
      value: "view",
      label: (
        <PiListBullets
          className={cn(
            "h-5 w-5 transition-colors group-hover:text-primary",
            !isGridLayout && "text-primary-foreground",
          )}
        />
      ),
    },
    {
      value: "grid",
      label: (
        <PiGridFour
          className={cn(
            "h-5 w-5 transition-colors group-hover:text-primary",
            isGridLayout && "text-primary-foreground",
          )}
        />
      ),
    },
  ];
  return <ToggleGroup options={options}></ToggleGroup>;
}
