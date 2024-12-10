import { useLocale } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function AttendanceReasonSelector({
  onChange,
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  const { t } = useLocale();
  const reasonsQuery = api.attendance.reasons.useQuery();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => {
        onChange?.(val);
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={t("select_an_option")} />
      </SelectTrigger>
      <SelectContent>
        {reasonsQuery.isPending && (
          <SelectItem disabled value="loading">
            {t("loading")}
          </SelectItem>
        )}
        {reasonsQuery.data?.map((reason) => (
          <SelectItem key={reason.id} value={reason.id.toString()}>
            {reason.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
