import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useLocale } from "~/i18n";

export interface InputDescriptionProps {
  className?: string;
}

export function RefTransactionInputss() {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    <FormField
      control={form.control}
      name="refTransaction"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("ref_transaction")}</FormLabel>
          <FormControl>
            <Input placeholder="Ref Transaction" {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
