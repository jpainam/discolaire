import { FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { useFormContext } from "react-hook-form";
import Select from "react-select";

type ReactSelectFieldProps = {
  className?: string;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  placeholder?: string;
  labelClassName?: string;
  items: { value: string; label: string }[];
  selectClassName?: string;
  description?: string;
  descriptionClassName?: string;
  disabled?: boolean;
};
export function ReactSelectField({
  items,
  label,
  onChange,
  placeholder,
  defaultValue,
  className,
  name,
  labelClassName,
}: ReactSelectFieldProps) {
  const handleChange = (newValue: { value: string; label: string } | null) => {
    if (newValue) {
      onChange && onChange(newValue.value);
    } else {
      onChange && onChange("");
    }
  };
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <Select
            options={items}
            placeholder={placeholder}
            value={items.find((c) => c.value === field.value)}
            onChange={(val) => field.onChange(val?.value)}
            defaultValue={items.find((c) => c.value === defaultValue)}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
