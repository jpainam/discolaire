"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DatePicker } from "~/components/DatePicker";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const schoolYearSchema = z.object({
  name: z.string().min(1),
  start: z.date(),
  end: z.date(),
  isActive: z.boolean().default(true),
  previousSchoolYearId: z.string().optional(),
});
interface CreateEditSchoolYearProps {
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}
export function CreateEditSchoolYear({
  name,
  id,
  startDate,
  endDate,
  isActive,
}: CreateEditSchoolYearProps) {
  const t = useTranslations();
  const form = useForm({
    resolver: standardSchemaResolver(schoolYearSchema),
    defaultValues: {
      start: startDate ?? new Date(),
      end: endDate ?? new Date(),
      name: name ?? "",
      isActive: isActive ?? true,
      previousSchoolYearId: "",
    },
  });
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const schoolYearQuery = useQuery(trpc.schoolYear.all.queryOptions());

  const updateSchoolYearMutation = useMutation(
    trpc.schoolYear.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYear.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const createSchoolYearMutation = useMutation(
    trpc.schoolYear.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYear.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof schoolYearSchema>) => {
    const values = {
      startDate: data.start,
      endDate: data.end,
      name: data.name,
      isActive: !data.isActive,
      previousSchoolYearId: data.previousSchoolYearId,
    };
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateSchoolYearMutation.mutate({ id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createSchoolYearMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Caption")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="start"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Start date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onSelectAction={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="end"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("End date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onSelectAction={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!id && (
          <FormField
            control={form.control}
            name="previousSchoolYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("Create from a previous school year?")}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("school_year")} />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolYearQuery.isPending && (
                        <SelectItem disabled value="loading">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </SelectItem>
                      )}
                      {schoolYearQuery.data?.map((schoolYear) => (
                        <SelectItem key={schoolYear.id} value={schoolYear.id}>
                          {schoolYear.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {id && (
          <FormField
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-4 flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    defaultChecked={!field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>{t("lock")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="mt-4 ml-auto flex flex-row gap-4">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createSchoolYearMutation.isPending ||
              updateSchoolYearMutation.isPending
            }
            variant={"default"}
            size={"sm"}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
