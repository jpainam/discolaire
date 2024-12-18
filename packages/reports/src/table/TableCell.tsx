import type { Style } from "@react-pdf/types";
import React from "react";
import { View } from "@react-pdf/renderer";

export interface TableCellProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  /**
   * The weighting of a cell based on the flex layout style.
   * This value is between 0..1, if not specified 1 is assumed, this will take up the remaining available space.
   */
  w?: number;
  firstColumn?: boolean;
  lastColumn?: boolean;
  style?: Style;
  firstRow?: boolean;
  lastRow?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export default function TableCell({
  children,
  style,
  w,
  firstColumn,
  lastColumn,
  firstRow,
  lastRow,
  ...rest
}: TableCellProps) {
  const borderMargin = `${Number(style?.borderWidth ?? 0) * -1}px`;
  const borderTop = firstRow
    ? undefined
    : `${style?.borderWidth} ${style?.borderStyle} ${style?.borderColor}`;
  const borderRight = `${style?.borderWidth} ${style?.borderStyle} ${style?.borderColor}`;
  const borderBottom = `${style?.borderWidth} ${style?.borderStyle} ${style?.borderColor}`;
  const borderLeft = firstColumn
    ? undefined
    : `${style?.borderWidth} ${style?.borderStyle} ${style?.borderColor}`;
  const margin = `${borderMargin} ${lastColumn ? borderMargin : "0"} ${lastRow ? borderMargin : 0} ${borderMargin}`;

  return (
    <View
      wrap={true}
      {...rest}
      style={{
        ...style,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        margin,
        flex: w ?? 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
