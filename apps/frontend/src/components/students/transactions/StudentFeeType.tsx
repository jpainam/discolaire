"use client";

import { useState } from "react";

import { useLocale } from "@repo/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";

import MoneyInHand from "~/components/icons/money-in-hand";

interface Item {
  id: number;
  title: string;
  checked: boolean;
  hover: boolean;
}

export function StudentFeeType() {
  const { t } = useLocale();
  const [items, setItems] = useState<Item[]>([
    { id: 1, title: "Complete project proposal", checked: false, hover: false },
    { id: 2, title: "Review team updates", checked: true, hover: false },
    {
      id: 3,
      title: "Prepare presentation slides",
      checked: false,
      hover: false,
    },
  ]);

  const handleCheckboxChange = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="border-b bg-muted/50 p-2">
        <CardTitle className="flex flex-row items-center">
          <MoneyInHand className="mr-2 h-4 w-4" />
          {t("Applicable fees")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-background px-2 py-4 shadow"
            >
              <div className="flex flex-grow items-center space-x-2">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                />
                <Label
                  htmlFor={`item-${item.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    item.checked ? "text-green-500 text-muted-foreground" : ""
                  }`}
                >
                  {item.title}
                </Label>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
