"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormContext,
} from "@repo/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { cn } from "~/lib/utils";

export default function PrintStartSelector() {
  const form = useFormContext();
  return (
    <>
      <FormField
        control={form.control}
        name="print_start"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Quand lancé l&apos;impression ?</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                  <Select
                    onValueChange={(value) =>
                      field.onChange(addDays(new Date(), parseInt(value)))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="0">Maintenant</SelectItem>
                      <SelectItem value="1">Demain</SelectItem>
                      <SelectItem value="3">Dans 3 jours</SelectItem>
                      <SelectItem value="7">Dans une semaine</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="rounded-md border">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
