"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";

type DatePickerProps = {
  description?: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
};
export function DatePickerField({
  description,
  name,
  label,
  placeholder,
  className,
  labelClassName,
  inputClassName,
  disabled = false,
}: DatePickerProps) {
  const form = useFormContext();
  const { i18n, t } = useLocale();
  const [open, setOpen] = useState(false);
  const currentLocale = i18n.language.includes("en")
    ? enUS
    : i18n.language.includes("es")
      ? es
      : fr;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  disabled={disabled}
                  className={cn(
                    "w-full text-left font-normal",
                    inputClassName,
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder ?? "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                disabled={disabled}
                selected={field.value}
                onSelect={(date) => {
                  date && field.onChange(date);
                  setOpen(false);
                }}
                /*disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }*/
                captionLayout="dropdown-buttons"
                fromYear={1930}
                toYear={2050}
                locale={currentLocale}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
