"use client";

import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
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
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { timezones } from "~/data/timezones";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { MultiSelectCombobox } from "./multi-selector";

const defaultSettingsSchema = z.object({
  defaultCountryId: z.string().min(1),
  applyRequiredFee: z.enum(["YES", "PASSIVE", "NO"]),
  includeRequiredFee: z.boolean(),
  numberOfReceipts: z.coerce.number().min(1),
  currency: z.string().min(1).default("CFA"),
  timezone: z.string().min(1).default("UTC"),
  allowOverEnrollment: z.boolean().default(true),
  requiredJournals: z.array(z.string()).optional(),
});
export function DefaultSettings({
  school,
}: {
  school: RouterOutputs["school"]["get"];
}) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const params = useParams<{ schoolId: string }>();

  const journalQuery = useQuery(trpc.accountingJournal.all.queryOptions());

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: standardSchemaResolver(defaultSettingsSchema),
    defaultValues: {
      defaultCountryId: school.defaultCountryId ?? "",
      applyRequiredFee: school.applyRequiredFee,
      includeRequiredFee: school.includeRequiredFee ?? false,
      numberOfReceipts: school.numberOfReceipts ?? 1,
      allowOverEnrollment: school.allowOverEnrollment ?? true,
      currency: school.currency,
      timezone: school.timezone,
      requiredJournals: school.requiredJournals.map((req) => req.journalId),
    },
  });
  const router = useRouter();
  const canUpdateSchool = useCheckPermission("school", PermissionAction.UPDATE);
  const updateDefaultSettings = useMutation(
    trpc.school.updateDefaultSettings.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.school.get.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof defaultSettingsSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateDefaultSettings.mutate({
      ...data,
      schoolId: params.schoolId,
      requiredJournals: data.requiredJournals ?? [],
    });
  };

  const disabled = !canUpdateSchool;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 xl:grid-cols-[1fr_40%]">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              disabled={disabled}
              control={form.control}
              name="defaultCountryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("default_country")}</FormLabel>
                  <FormControl>
                    <CountryPicker placeholder={t("country")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("timezones")}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("timezones")} />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((timezone, index) => (
                          <SelectItem
                            key={`${timezone.utc}-${index}`}
                            value={timezone.tzCode}
                          >
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applyRequiredFee"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("activate_required_fees")}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">
                          {t("yes_and_active")}
                        </SelectItem>
                        <SelectItem value="PASSIVE">
                          {t("yes_but_passive")}
                        </SelectItem>
                        <SelectItem value="NO">{t("no")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currency")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfReceipts"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("number_of_receipts_to_print")}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disabled}
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requiredJournals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("required_fees")}</FormLabel>
                  <FormControl>
                    {journalQuery.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MultiSelectCombobox
                        label={t("required_fees")}
                        options={(journalQuery.data ?? []).map((journal) => ({
                          label: journal.name,
                          value: journal.id,
                        }))}
                        value={field.value ?? [""]}
                        onChange={(val) => field.onChange(val)}
                        renderItem={(option) => option.label}
                        renderSelectedItem={(value: string[]) => {
                          if (value.length === 0) return "";
                          if (value.length === 1) {
                            return journalQuery.data?.find(
                              (p) => p.id === value[0],
                            )?.name;
                          }
                          return `${value.length} journals selected`;
                        }}
                      />
                    )}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="allowOverEnrollment"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label className="flex items-center justify-between gap-6 rounded-lg border p-4 has-[[data-state=checked]]:border-blue-600">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">
                          {t("Classroom maximum size")}
                        </div>
                        <div className="text-muted-foreground text-sm font-normal">
                          {t(
                            "Allow enrollments in classrooms that exceed the maximum size",
                          )}
                        </div>
                      </div>
                      <Switch
                        disabled={disabled}
                        defaultChecked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                        id="switch-demo-focus-mode1"
                        className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600"
                      />
                    </Label>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="includeRequiredFee"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label className="flex items-center justify-between gap-6 rounded-lg border p-4 has-[[data-state=checked]]:border-blue-600">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{t("required_fees")}</div>
                        <div className="text-muted-foreground text-sm font-normal">
                          {t("Include required fees in cash reports?")}
                        </div>
                      </div>
                      <Switch
                        defaultChecked={field.value}
                        disabled={disabled}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                        id="switch-demo-focus-mode2"
                        className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600"
                      />
                    </Label>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-full flex flex-row justify-end gap-2">
          <Button
            variant={"outline"}
            disabled={disabled}
            type="button"
            onClick={() => {
              form.reset();
            }}
            size={"sm"}
          >
            {t("reset")}
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || disabled}
            isLoading={updateDefaultSettings.isPending}
            size={"sm"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
