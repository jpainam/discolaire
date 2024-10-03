"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";

import { CountryPicker } from "~/components/shared/CountryPicker";
import { api } from "~/trpc/react";

export function DefaultSettings() {
  const { t } = useLocale();
  const params = useParams<{ schoolId: string }>();
  const schoolQuery = api.school.get.useQuery(params.schoolId);
  const utils = api.useUtils();
  const updateDefaultCountry = api.school.updateDefaultCountry.useMutation({
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
          updateDefaultCountry.mutate({
            schoolId: params.schoolId,
            countryId: country,
          });
        }}
        defaultValue={school?.defaultCountryId ?? undefined}
      />
    </div>
  );
}
