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
import { AlarmClock, AlarmClockCheck, AlarmClockMinus } from "lucide-react";

export function TransactionStatusSelector({
  onChange,
  className,
  placeholder,
}: {
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const { t } = useLocale();
  return (
    <Select
      onValueChange={(val) => {
        if (onChange) {
          onChange(val);
        }
      }}
    >
      <SelectTrigger className={cn("w-[280px]", className)}>
        <SelectValue
          placeholder={placeholder ? placeholder : t("select_an_option")}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className="flex" value="VALIDATED">
            <div className="flex flex-row items-center gap-1 text-green-600">
              <AlarmClockCheck className="h-4 w-4" />
              {t("validated")}
            </div>
          </SelectItem>
          <SelectItem value="IN_PROGRESS">
            <div className="flex flex-row items-center gap-1 text-yellow-600">
              <AlarmClock className="h-4 w-4" />
              {t("in_progress")}
            </div>
          </SelectItem>
          <SelectItem value="CANCELLED">
            <div className="flex flex-row items-center gap-1 text-red-600">
              <AlarmClockMinus className="h-4 w-4" />
              {t("cancelled")}
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
