"use client";

import { useParams } from "next/navigation";
import { useAtom } from "jotai";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";

import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { requiredFeesAtom } from "./required-fees-atom";

type RequiredFee = RouterOutputs["student"]["unpaidRequiredFees"][number];

export function RequiredFeeForm() {
  const params = useParams<{ id: string }>();
  const unpaidRequiredFeeQuery = api.student.unpaidRequiredFees.useQuery(
    params.id,
  );
  const [requiredFees, setRequiredFees] = useAtom(requiredFeesAtom);

  const { t, i18n } = useLocale();
  const handleCheckboxChange = (fee: RequiredFee) => {
    setRequiredFees((prev) =>
      prev.includes(fee.id)
        ? prev.filter((i) => i !== fee.id)
        : [...prev, fee.id],
    );
  };

  if (unpaidRequiredFeeQuery.isPending) {
    return <Skeleton className="col-span-full h-8 w-full" />;
  }
  const data = unpaidRequiredFeeQuery.data ?? [];
  if (data.length === 0) {
    return null;
  }
  return (
    <Card className="mx-4 mb-4 border-t-4 border-t-destructive">
      <CardHeader className="border-b p-0">
        <CardTitle className="p-2 text-lg font-semibold text-destructive">
          {t("required_fees")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 p-2">
        {data.map((fee, index) => {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`requiredfee-${index}`}
                checked={requiredFees.includes(fee.id)}
                onCheckedChange={() => handleCheckboxChange(fee)}
              />
              <Label
                htmlFor={`requiredfee-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {fee.description} (
                {fee.amount.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
                )
              </Label>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="p-2 text-center text-sm text-destructive">
        {t("required_fee_warning")}
      </CardFooter>
    </Card>
  );
}
