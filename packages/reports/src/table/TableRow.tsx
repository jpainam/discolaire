import type { Style } from "@react-pdf/types";
import React from "react";
import { View } from "@react-pdf/renderer";

export interface TableRowProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  style?: Style;
  children?: React.ReactNode | React.ReactNode[];
}

export default function TableRow({ children, style }: TableRowProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        ...style,
      }}
    >
      {children}
    </View>
  );
}
