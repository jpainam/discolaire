"use client";

import { useState } from "react";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  description?: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  timeZone?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}
export function DatePickerField({
  description,
  name,
  label,
  placeholder,
  className,
  timeZone,
  labelClassName,
  inputClassName,
  disabled = false,
}: DatePickerProps) {
  const form = useFormContext();
  const { i18n } = useLocale();
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
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
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
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
                  timeZone={timeZone}
                  mode="single"
                  disabled={disabled}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  /*disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }*/
                  startMonth={new Date(1930, 0)}
                  endMonth={new Date(2050, 11)}
                  locale={currentLocale}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
