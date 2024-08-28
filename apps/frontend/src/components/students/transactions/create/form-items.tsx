import { useFormContext } from "react-hook-form";

import { useLocale } from "@repo/i18n";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { cn } from "~/lib/utils";

export interface InputDescriptionProps {
  className?: string;
}
export function DescriptionInput({ className }: InputDescriptionProps) {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    
  );
}

export function RefTransactionInput() {
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

export function AmountInput() {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("amount")}</FormLabel>
          <FormControl>
            <Input type="number" placeholder={t("amount")} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectPaymentMethod({ className }: { className?: string }) {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{t("payment_method")}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("choose_payment_method")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="cash">{t("cash")}</SelectItem>
              <SelectItem value="card">{t("card")}</SelectItem>
              <SelectItem value="check">{t("check")}</SelectItem>
              <SelectItem value="emoney">{t("emoney")}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const items: { label: string; value: string }[] = [
  { label: "credit", value: "CREDIT" },
  { label: "debit", value: "DEBIT" },
  { label: "discount", value: "REFUND" },
];

export function SelectTransactionType({ className }: { className?: string }) {
  const form = useFormContext();
  const { t } = useLocale();
  return (
    <FormField
      control={form.control}
      name="transactionType"
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{t("transaction_type")}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("choose_transaction_type")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
