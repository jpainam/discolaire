import type { Style } from "@react-pdf/types";
import type { PropsWithChildren } from "react";
import React from "react";
import { View } from "@react-pdf/renderer";

export default function Table({
  children,
  weightings,
  style,
}: PropsWithChildren<{ style?: Style; weightings?: number[] }>) {
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
      {React.Children.map(children, (child) => {
        if (!child || !React.isValidElement(child)) return;
        // @ts-expect-error TODO FIX it
        return React.cloneElement(child, { weightings });
      })}
    </View>
  );
}
