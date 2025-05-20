"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useLocale } from "~/i18n";
const schema = z.object({
  quantity: z.coerce.number().default(1),
  note: z.string().optional(),
  userId: z.string().min(1),
});

export function CreateEditAttribution({
  type,
  quantity,
  id,
  note,
  name,
  currentStock,
  userId,
}: {
  type: "CONSUMABLE" | "ASSET";
  quantity?: number;
  name: string;
  currentStock: number;
  note?: string;
  id: string;
  userId?: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: quantity ?? 1,
      note: note ?? "",
      userId: userId ?? "",
    },
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };
  const { t } = useLocale();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="gap-4 grid grid-cols-1 px-4"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("user")}</FormLabel>
              <FormControl>
                <UserSelector
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          disabled={type === "ASSET"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("quantity")}</FormLabel>
              <FormControl>
                <Input disabled={type == "ASSET"} type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("observation")}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-2">
          <Button size={"sm"}>{t("submit")}</Button>
          <Button type="button" size={"sm"}>
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
