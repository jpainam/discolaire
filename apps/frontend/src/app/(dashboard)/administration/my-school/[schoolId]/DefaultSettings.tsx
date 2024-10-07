"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Skeleton } from "@repo/ui/skeleton";
import { Switch } from "@repo/ui/switch";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { api } from "~/trpc/react";

export function DefaultSettings() {
  const { t } = useLocale();
  const params = useParams<{ schoolId: string }>();
  const schoolQuery = api.school.get.useQuery(params.schoolId);
  const utils = api.useUtils();
  const updateDefaultSettings = api.school.updateDefaultSettings.useMutation({
    onSettled: () => utils.school.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  if (schoolQuery.isPending) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  const school = schoolQuery.data;
  return (
    <div className="grid grid-cols-2 gap-2">
      <Label>{t("default_country")}</Label>

      <CountryPicker
        placeholder={t("country")}
        onChange={(country) => {
          updateDefaultSettings.mutate({
            schoolId: params.schoolId,
            countryId: country,
          });
        }}
        defaultValue={school?.defaultCountryId ?? undefined}
      />
      <Label>{t("activate_required_fees")}</Label>
      <Select
        defaultValue={school?.applyRequiredFee ?? "NO"}
        onValueChange={(val) => {
          toast.success(t("updating"), { id: 0 });
          updateDefaultSettings.mutate({
            schoolId: params.schoolId,
            applyRequiredFee: val as "YES" | "PASSIVE" | "NO",
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="YES">{t("yes_and_strict")}</SelectItem>
          <SelectItem value="PASSIVE">{t("yes_but_passive")}</SelectItem>
          <SelectItem value="NO">{t("no")}</SelectItem>
        </SelectContent>
      </Select>
      <Label>{t("include_required_fees_in_finances")}</Label>
      <Switch
        defaultChecked={school?.includeRequiredFee ?? false}
        //checked={school?.includeRequiredFee ?? false}
        onCheckedChange={(checked) => {
          toast.success(t("updating"), { id: 0 });
          updateDefaultSettings.mutate({
            schoolId: params.schoolId,
            includeRequiredFee: checked,
          });
        }}
      />
    </div>
  );
}
