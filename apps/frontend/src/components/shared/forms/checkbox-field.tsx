/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@repo/ui/components/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";

import { cn } from "~/lib/utils";

interface InputFieldProps {
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
}
export function CheckboxField({
  descriptionClassName,
  disabled,
  label,
  labelClassName,
  className,
  name,
  //placeholder,
  description,
  checkboxClassName,
  //type = "text",
}: InputFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-y-0 space-x-3",
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
