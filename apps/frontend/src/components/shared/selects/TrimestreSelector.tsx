"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/utils";
export function TrimestreSelector({
  onChange,
  defaultValue,
  className,
}: {
  onChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}) {
  //const { t } = useLocale();
  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Choisir un trimestre/Annuell" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="trim1">Trimestre 1</SelectItem>
        <SelectItem value="trim2">Trimestre 2</SelectItem>
        <SelectItem value="trim3">Trimestre 3</SelectItem>
        <SelectItem value="ann">Annuelle</SelectItem>
      </SelectContent>
    </Select>
  );
}
