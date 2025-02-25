"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { cn } from "~/lib/utils";

interface InputFieldProps {
  label?: string;
  className?: string;
  name: string;
  placeholder?: string;
  description?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  disabled?: boolean;
  inputClassName?: string;
  type?: string;
}
export function InputField({
  descriptionClassName,
  disabled,
  label,
  labelClassName,
  className,
  name,
  placeholder,
  description,
  inputClassName,
  type = "text",
}: InputFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              className={inputClassName}
              disabled={disabled}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
