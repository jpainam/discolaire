import type { Style } from "@react-pdf/types";
import React from "react";
import { Text, View } from "@react-pdf/renderer";

export interface TableCellProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  /**
   * The weighting of a cell based on the flex layout style.
   * This value is between 0..1, if not specified 1 is assumed, this will take up the remaining available space.
   */
  w?: number;

  style?: Style;

  children?: React.ReactNode | React.ReactNode[];
}

export default function TableCell({
  children,
  style,
  w,

  ...rest
}: TableCellProps) {
  return (
    <View
      wrap={true}
      {...rest}
      style={{
        ...style,
        flex: w ?? 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text>{children}</Text>
    </View>
  );
}
