import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

interface SelectTransactionTypeProps {
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

const items: { label: string; value: string }[] = [
  { label: "credit", value: "CREDIT" },
  { label: "debit", value: "DEBIT" },
  { label: "discount", value: "RETURN" },
  { label: "moratorium", value: "MORATORIUM" },
];

export function SelectTransactionType({
  className,
  labelClassName,
  defaultValue,
  triggerClassName,
  label,
  onChange,
  placeholder,
}: SelectTransactionTypeProps) {
  const { t } = useLocale();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Label className={cn("hidden md:flex", labelClassName)} htmlFor="grade">
        {label}
      </Label>
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => {
          onChange(value);
        }}
      >
        <SelectTrigger className={cn(triggerClassName)}>
          <SelectValue placeholder={placeholder ?? t("select_an_option")} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => {
            return (
              <SelectItem
                key={item.value}
                value={item.value}
                //onClick={() => onChange(item.value)}
              >
                {t(item.label)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
