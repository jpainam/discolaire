/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

//import { toast } from "~/components/ui/use-toast";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function PrintTypeRadio() {
  const form = useFormContext();
  return (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex gap-3">
            <FormLabel>Imprimer le rapport en ?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="inline-flex gap-5"
              >
                <FormItem className="flex items-center space-y-0 space-x-3">
                  <FormControl>
                    <RadioGroupItem value="pdf" />
                  </FormControl>
                  <FormLabel className="font-normal">PDF</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-y-0 space-x-3">
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
