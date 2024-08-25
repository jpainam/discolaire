import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

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
        onChange && onChange(val);
      }}
      defaultValue={defaultValue || "M"}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder || t("selectAPrefix")} />
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
