import type { Style } from "@react-pdf/types";
import type { PropsWithChildren } from "react";
import { View } from "@react-pdf/renderer";

export default function Table({
  children,
  weightings,
  style,
}: PropsWithChildren<{ style?: Style; weightings?: number[] }>) {
  console.log(weightings);
  return (
    <View
      style={{
        ...style,
        borderColor: style?.borderColor ?? "#000000",
        borderWidth: style?.borderWidth ?? 1,
        borderStyle: style?.borderStyle ?? "solid",
        width: "100%",
      }}
    >
      {children}
    </View>
  );
}
