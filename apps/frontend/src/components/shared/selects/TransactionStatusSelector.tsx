import { AlarmClock, AlarmClockCheck, AlarmClockMinus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useLocale } from "~/i18n";

import { cn } from "~/lib/utils";

export function TransactionStatusSelector({
  onChange,
  className,
  placeholder,
}: {
  onChange?: (value?: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const { t } = useLocale();
  return (
    <Select
      onValueChange={(val) => {
        onChange?.(val == "all" ? undefined : val);
      }}
    >
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue placeholder={placeholder ?? t("select_an_option")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <AlarmClockMinus /> {t("all")}
        </SelectItem>
        <SelectItem className="flex" value="VALIDATED">
          <div className="flex flex-row items-center gap-1 text-green-600">
            <AlarmClockCheck className="h-4 w-4" />
            {t("validated")}
          </div>
        </SelectItem>
        <SelectItem value="PENDING">
          <div className="flex flex-row items-center gap-1 text-yellow-600">
            <AlarmClock className="h-4 w-4" />
            {t("pending")}
          </div>
        </SelectItem>
        <SelectItem value="CANCELED">
          <div className="flex flex-row items-center gap-1 text-red-600">
            <AlarmClockMinus className="h-4 w-4" />
            {t("canceled")}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
