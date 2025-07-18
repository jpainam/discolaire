"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SettingsIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "~/components/DatePicker";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  options: z.array(
    z.object({
      //active: z.boolean().default(false),
      termId: z.string(),
      date: z.coerce.date(),
      observation: z.string().default(""),
    }),
  ),
});
export function GradeReportSettings() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());
  const periodes = terms.map((term) => {
    return {
      //active: false,
      id: term.id.toString(),
      observation: "",
      name: term.name,
      date: term.endDate,
    };
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: periodes.map((p) => ({
        termId: p.id,
        date: p.date,
        observation: "",
      })),
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              {t("settings")}
            </CardTitle>
            <CardDescription>
              Sera publié après le conseil de classe ou le 29/08/2024
            </CardDescription>
            {form.formState.isDirty && (
              <CardAction className="flex flex-row gap-2 items-center">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  {t("reset")}
                </Button>
                <Button size={"sm"}>{t("submit")}</Button>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="text-sm grid grid-cols-1 gap-4">
            {periodes.map((p, index) => {
              return (
                <div
                  key={`${p.id}-${index}`}
                  className="grid grid-cols-[40%_60%] gap-2 items-center"
                >
                  {/* <Input
                    value={p.id}
                    className="hidden"
                    {...form.register(`options.${index}.termId`)}
                  /> */}

                  <FormField
                    control={form.control}
                    name={`options.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{p.name}</FormLabel>
                        <FormControl>
                          <DatePicker
                            defaultValue={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`options.${index}.observation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("observation")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            // className="resize-none"
                            placeholder="Sera publié après le conseil de classe ou le 29/08/2024"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}

            {/* <div className="grid grid-cols-2 gap-2">
              <Label>Date de publication</Label>
              <Textarea placeholder=" Sera publié après le conseil de classe ou le 29/08/2024"></Textarea>
              <DatePicker />
            </div> */}
          </CardContent>
        </Card>
        {/* <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <div></div>
            <div>A été publié le 23/11/2023</div>
          </div>
          <div>
            Statistique: Moyenne: Generale, % reussite
            (nbreussite/nbecheck){" "}
          </div>
          <div>Conseil de classe</div>
        </div> */}
      </form>
    </Form>
  );
}
