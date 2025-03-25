"use client";

import type { RouterOutputs } from "@repo/api";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AlertState } from "~/components/AlertState";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { requiredFeesAtom } from "./required-fees-atom";

type RequiredFee = RouterOutputs["student"]["unpaidRequiredFees"][number];

export function RequiredFeeForm2() {
  const params = useParams<{ id: string }>();
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  // Toggle action selection
  const toggleAction = (feeId: number) => {
    if (selectedActions.includes(feeId)) {
      setSelectedActions(selectedActions.filter((a) => a !== feeId));
    } else {
      setSelectedActions([...selectedActions, feeId]);
    }
  };
  const [requiredFees, setRequiredFees] = useAtom(requiredFeesAtom);

  const handleCheckboxChange = (fee: RequiredFee) => {
    setRequiredFees((prev) =>
      prev.includes(fee.id)
        ? prev.filter((i) => i !== fee.id)
        : [...prev, fee.id]
    );
  };
  const trpc = useTRPC();
  const unpaidRequiredFeeQuery = useQuery(
    trpc.student.unpaidRequiredFees.queryOptions(params.id)
  );
  const { t, i18n } = useLocale();
  if (unpaidRequiredFeeQuery.isPending) {
    return <Skeleton className="col-span-full h-8 w-full" />;
  }
  const data = unpaidRequiredFeeQuery.data ?? [];
  if (data.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <AlertState variant="warning">{t("required_fee_warning")}</AlertState>
      <div className="flex flex-row gap-2 items-center">
        <Label>{t("required_fees")}</Label>
        {data.map((fee, index) => {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`requiredfee-${index}`}
                checked={requiredFees.includes(fee.id)}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(fee);
                  toggleAction(fee.id);
                }}
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
      </div>
    </div>
  );
}
