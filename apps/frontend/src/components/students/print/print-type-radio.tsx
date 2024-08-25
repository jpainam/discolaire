"use client";

//import { toast } from "@repo/ui/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { useFormContext } from "react-hook-form";

export default function PrintTypeRadio() {
  const form = useFormContext();
  return (
    <>
      <FormLabel>Imprimer le rapport en ?</FormLabel>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex gap-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="inline-flex gap-5"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="pdf" />
                  </FormControl>
                  <FormLabel className="font-normal">PDF</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="excel" />
                  </FormControl>
                  <FormLabel className="font-normal">Excel</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
