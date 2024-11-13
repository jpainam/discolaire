import type { Style } from "@react-pdf/types";
import React, { useMemo } from "react";
import { View } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";

export interface TableProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  weightings?: number[];
  tdStyle?: Style | Style[];
  trStyle?: Style | Style[];
  children: React.ReactNode | React.ReactNode[];
}

export interface TableContextType {
  weightings?: number[];
  style: Omit<Style, "borderWidth"> & {
    borderWidth: number;
  };
  tdStyle?: TableProps["tdStyle"];
  trStyle?: TableProps["trStyle"];
}

export const tableContext = React.createContext<TableContextType>({
  style: {
    borderWidth: 1,
  },
});

export default function Table({
  children,
  weightings,
  style: styleProps,
  tdStyle,
  trStyle,
  ...rest
}: TableProps) {
  const tableStyle = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const style = flatten([
      {
        borderColor: "#000000",
        borderWidth: 1,
        borderStyle: "solid",
      },
      ...(Array.isArray(styleProps) ? styleProps : [styleProps]),
    ]) as TableContextType["style"];

    if (typeof style.border === "string") {
      const [borderWidth, borderStyle, borderColor] = style.border.split(/\s+/);

      style.borderWidth = borderWidth ? Number.parseFloat(borderWidth) : 0;
      style.borderStyle = borderStyle as Style["borderStyle"];
      style.borderColor = borderColor;
    } else if (typeof style.border === "number") {
      style.borderWidth = style.border;
    }
    if (typeof style.borderWidth === "string") {
      style.borderWidth = Number.parseFloat(style.borderWidth);
    }

    return style;
  }, [styleProps]);

  const rows = useMemo(() => {
    const output: React.ReactElement[] = [];

    const flattenChildren = (elem: typeof children) => {
      React.Children.forEach(elem, (child) => {
        if (!React.isValidElement(child)) {
          return;
        }

        if (child.type === React.Fragment) {
          flattenChildren(
            (child.props as { children?: React.ReactNode }).children,
          );
        } else {
          output.push(child);
        }
      });
    };
    flattenChildren(children);

    return output.map((tr, rowIndex) =>
      React.cloneElement(
        tr as React.ReactElement<{ _firstRow?: boolean; _lastRow?: boolean }>,
        {
          key: `table_row_${rowIndex}`,
          _firstRow: rowIndex === 0,
          _lastRow: rowIndex === output.length - 1,
        },
      ),
    );
  }, [children]);

  const style = useMemo(
    () =>
      [
        {
          width: "100%",
        },
        ...(Array.isArray(styleProps) ? styleProps : [styleProps]),
        tableStyle.borderStyle === "solid"
          ? {
              border: 0,
            }
          : undefined,
      ].filter((s): s is Style => s !== undefined),
    [styleProps],
  );

  const tableContextValue = useMemo<TableContextType>(
    () => ({
      style: tableStyle,
      weightings,
      tdStyle,
      trStyle,
    }),
    [tableStyle, weightings, tdStyle, trStyle],
  );

  return (
    <tableContext.Provider value={tableContextValue}>
      <View {...rest} style={style}>
        {rows}
      </View>
    </tableContext.Provider>
  );
}
