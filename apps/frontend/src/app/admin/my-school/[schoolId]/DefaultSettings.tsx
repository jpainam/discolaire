"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Switch } from "@repo/ui/switch";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const defaultSettingsSchema = z.object({
  defaultCountryId: z.string().min(1),
  applyRequiredFee: z.enum(["YES", "PASSIVE", "NO"]),
  includeRequiredFee: z.boolean(),
  numberOfReceipts: z.coerce.number().min(1),
  currency: z.string().min(1).default("FCFA"),
});
export function DefaultSettings({
  school,
}: {
  school: NonNullable<RouterOutputs["school"]["get"]>;
}) {
  const { t } = useLocale();
  const params = useParams<{ schoolId: string }>();
  const utils = api.useUtils();
  const form = useForm({
    schema: defaultSettingsSchema,
    defaultValues: {
      defaultCountryId: school.defaultCountryId ?? "",
      applyRequiredFee: school.applyRequiredFee,
      includeRequiredFee: school.includeRequiredFee ?? false,
      numberOfReceipts: school.numberOfReceipts ?? 1,
      currency: school.currency,
    },
  });
  const router = useRouter();
  const updateDefaultSettings = api.school.updateDefaultSettings.useMutation({
    onSettled: () => utils.school.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.push(routes.administration.my_school.details(params.schoolId));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const handleSubmit = (data: z.infer<typeof defaultSettingsSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateDefaultSettings.mutate({
      ...data,
      schoolId: params.schoolId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 gap-2">
          <FormField
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
            name="applyRequiredFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("activate_required_fees")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">{t("yes_and_active")}</SelectItem>
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
            name="includeRequiredFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("include_required_fees_in_finances")}</FormLabel>
                <FormControl>
                  <Switch
                    defaultChecked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("number_of_receipts_to_print")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <SelectTrigger>
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

          <div className="col-span-full flex flex-row justify-end gap-2">
            <Button
              variant={"outline"}
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
              disabled={!form.formState.isDirty}
              isLoading={updateDefaultSettings.isPending}
              size={"sm"}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
