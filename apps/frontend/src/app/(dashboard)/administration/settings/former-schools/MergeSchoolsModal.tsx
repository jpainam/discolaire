"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

type FormerSchool = RouterOutputs["formerSchool"]["list"]["data"][number];

const mergeSchema = z.object({
  name: z.string().min(1),
});

export function MergeSchoolsModal({ table }: { table: Table<FormerSchool> }) {
  const t = useTranslations();
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [schoolsToMerge, setSchoolsToMerge] = React.useState(() =>
    table.getFilteredSelectedRowModel().rows.map((r) => r.original),
  );

  const removeSchool = (id: string) => {
    setSchoolsToMerge((prev) => prev.filter((s) => s.id !== id));
  };

  const form = useForm({
    resolver: standardSchemaResolver(mergeSchema),
    defaultValues: { name: "" },
  });

  const mergeMutation = useMutation(
    trpc.formerSchool.merge.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.formerSchool.list.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.formerSchool.all.pathFilter());
        table.toggleAllRowsSelected(false);
        toast.success(t("merged_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof mergeSchema>) => {
    toast.loading(t("merging"), { id: 0 });
    mergeMutation.mutate({
      name: data.name,
      ids: schoolsToMerge.map((s) => s.id),
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Label className="text-muted-foreground">
          {schoolsToMerge.length} {t("schools_will_be_merged")}
        </Label>
        <ScrollArea className="bg-muted max-h-40 rounded-md px-4 py-2">
          <ul className="space-y-1 py-1 text-xs">
            {schoolsToMerge.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2"
              >
                <span>{s.name}</span>
                <Button
                  type="button"
                  size={"icon-xs"}
                  variant={"ghost"}
                  onClick={() => removeSchool(s.id)}
                  aria-label={`Remove ${s.name}`}
                >
                  <X size={12} className="text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("new_name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => closeModal()}>
            {t("cancel")}
          </Button>
          <Button
            disabled={mergeMutation.isPending || schoolsToMerge.length < 2}
            variant="default"
          >
            {mergeMutation.isPending && <Spinner />}
            {t("merge")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
