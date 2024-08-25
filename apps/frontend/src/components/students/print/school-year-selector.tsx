"use client";

//import { toast } from "@repo/ui/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useFormContext } from "react-hook-form";

import { api } from "~/trpc/react";

export default function SchoolYearSelector() {
  const form = useFormContext();
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  return (
    <>
      <FormLabel>Imprimer pour l&apos;année scolaire ?</FormLabel>
      <FormField
        control={form.control}
        name="school_year"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Année en cours..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {schoolYearsQuery.data?.map((year) => (
                  <SelectItem key={year.id} value={year.name ?? ""}>
                    {year.name ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
