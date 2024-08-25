import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useFormContext } from "react-hook-form";

import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";

type SelectClass = {
  className?: string;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
};
export function SelectClass({
  className,
  name,
  label,
  onChange,
  defaultValue,
}: SelectClass) {
  const form = useFormContext();
  const { t } = useLocale();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("md:w-[50%] lg:w-[30%]", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            defaultValue={defaultValue ?? field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Choisir la méthode de paiment" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="cash">{t("cash")}</SelectItem>
              <SelectItem value="card">{t("card")}</SelectItem>
              <SelectItem value="check">{t("check")}</SelectItem>
              <SelectItem value="emoney">{t("emoney")}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
