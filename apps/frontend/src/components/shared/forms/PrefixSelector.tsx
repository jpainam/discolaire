import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useLocale } from "~/i18n";
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
  const { t } = useLocale();
  const items: { label: string; value: string }[] = [
    { label: t("M"), value: "M" },
    { label: t("Mme"), value: "Mme" },
    { label: t("Mlle"), value: "Mlle" },
    { label: t("Dr"), value: "Dr" },
  ];
  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val);
      }}
      defaultValue={defaultValue ?? "M"}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
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
