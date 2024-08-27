import React, { useState } from "react";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";

interface ToggleSelectorProps {
  items: { label: React.ReactNode | string; value: string }[];
  onChange: (value: string) => void;
  defaultValue?: string;
}
export function ToggleSelector({
  items,
  defaultValue,
  onChange,
}: ToggleSelectorProps) {
  const [selected, setSelected] = useState<string | undefined>(defaultValue);

  return (
    <RadioGroup
      onValueChange={(value) => {
        setSelected(value);
        onChange(value);
      }}
      defaultValue={defaultValue}
      className={`grid grid-cols-${items.length} gap-0`}
    >
      {items.map((item) => {
        return (
          <div key={item.value}>
            <RadioGroupItem
              value={item.value}
              id={item.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={item.value}
              className="flex flex-col items-center justify-between border p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary/75"
            >
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
