import React from "react";
import { Checkbox } from "@repo/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { useFormContext } from "react-hook-form";

import { cn } from "~/lib/utils";

type InputFieldProps = {
  label?: React.ReactNode;
  className?: string;
  name: string;
  placeholder?: string;
  description?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  disabled?: boolean;
  checkboxClassName?: string;
  type?: string;
};
export function CheckboxField({
  descriptionClassName,
  disabled,
  label,
  labelClassName,
  className,
  name,
  placeholder,
  description,
  checkboxClassName,
  type = "text",
}: InputFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0",
            className,
          )}
        >
          <FormControl>
            <Checkbox
              disabled={disabled}
              className={checkboxClassName}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormDescription className={descriptionClassName}>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
