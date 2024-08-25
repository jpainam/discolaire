import { cn } from "@/lib/utils";
import { addSpacesToCamelCase } from "@/utils/add-spaces-to-camel-case";
import { formatNumber } from "@/utils/format-number";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

function isValidHexColor(colorCode: string) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(colorCode);
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  prefix?: string;
  postfix?: string;
  className?: string;
  formattedNumber?: boolean;
}

export function CustomTooltip({
  label,
  prefix,
  active,
  postfix,
  payload,
  className,
  formattedNumber,
}: CustomTooltipProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-gray-300 bg-background shadow-2xl",
        className,
      )}
    >
      <div className="mb-0.5 block p-2 px-2.5 text-center font-lexend text-xs font-semibold capitalize bg-secondary text-secondary-foreground">
        {label}
      </div>
      <div className="px-3 py-1.5 text-xs">
        {payload?.map((item: any, index: number) => (
          <div
            key={item.dataKey + index}
            className="chart-tooltip-item flex items-center py-1.5"
          >
            <span
              className="me-1.5 h-2 w-2 rounded-full"
              style={{
                backgroundColor: isValidHexColor(item.fill)
                  ? item.fill === "#fff"
                    ? item.stroke
                    : item.fill
                  : item.stroke,
              }}
            />
            <div>
              <span className="capitalize">
                {addSpacesToCamelCase(item.dataKey)}:
              </span>{" "}
              <span className="font-medium text-gray-900 dark:text-gray-700">
                {prefix && prefix}
                {formattedNumber ? formatNumber(item.value) : item.value}
                {postfix && postfix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
