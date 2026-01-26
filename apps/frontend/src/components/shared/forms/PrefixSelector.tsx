import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export default function PrefixSelector({
  className,
  onChange,
  placeholder,
  defaultValue,
}: {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const items: { label: string; value: string }[] = [
    { label: "M", value: "M" },
    { label: "Mme", value: "Mme" },
    { label: "Mlle", value: "Mlle" },
    { label: "Dr", value: "Dr" },
  ];
  const t = useTranslations();
  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val);
      }}
      defaultValue={defaultValue ?? "M"}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder ?? t("prefix")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
