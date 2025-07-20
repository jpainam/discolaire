"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { cn } from "~/lib/utils";

interface SelectFieldProps {
  className?: string;
  name: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  items?: { value: string | number; label: string }[];
  description?: string;
  disabled?: boolean;
  inputClassName?: string;
}
export function SelectField({
  name,
  label,
  description,
  inputClassName,
  placeholder,
  className,
  labelClassName,
  disabled,
  items,
}: SelectFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn("w-full", inputClassName)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items?.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {description && (
            <FormDescription className="text-muted-foreground text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
