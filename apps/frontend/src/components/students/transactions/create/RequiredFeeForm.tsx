"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/hooks/use-locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";

import { api } from "~/trpc/react";

type RequiredFee = RouterOutputs["student"]["unpaidRequiredFees"][number];
export function RequiredFeeForm() {
  const params = useParams<{ id: string }>();
  const [selectedItems, setSelectedItems] = useState<RequiredFee[]>([]);
  const { t } = useLocale();
  const handleCheckboxChange = (fee: RequiredFee) => {
    setSelectedItems((prev) =>
      prev.includes(fee) ? prev.filter((i) => i.id !== fee.id) : [...prev, fee],
    );
  };
  const unpaidRequiredFeeQuery = api.student.unpaidRequiredFees.useQuery(
    params.id,
  );
  const data = unpaidRequiredFeeQuery.data ?? [];
  return (
    <Card className="mx-4 mb-4 border-t-4 border-t-orange-600">
      <CardHeader className="border-b p-0">
        <CardTitle className="p-2 text-lg font-semibold text-orange-600">
          {t("required_fees")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 p-2">
        {data.map((fee, index) => {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`requiredfee-${index}`}
                checked={selectedItems.includes(fee)}
                onCheckedChange={() => handleCheckboxChange(fee)}
              />
              <Label
                htmlFor={`requiredfee-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Frais obligatoire (20 000 FCFA)
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
