import React, { useContext, useMemo } from "react";
import { View } from "@react-pdf/renderer";

import { tableContext } from "./Table";

export interface TableRowProps
  extends Omit<React.ComponentProps<typeof View>, "children"> {
  _firstRow?: boolean;
  _lastRow?: boolean;

  children?: React.ReactNode | React.ReactNode[];
}

export default function TableRow({
  children,
  style: styleProps,
  _firstRow,
  _lastRow,
  ...rest
}: TableRowProps) {
  const { trStyle, weightings: tableWeightings } = useContext(tableContext);

  const cells = useMemo(() => {
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

    let weightings: (number | undefined)[] = [];

    for (const [index, row] of output.entries()) {
      // @ts-expect-error TODO: fix this
      if (row.props?.weighting) {
        // @ts-expect-error TODO: fix this
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        weightings.push(row.props.weighting);
      } else {
        weightings.push(tableWeightings?.[index]);
      }
    }

    const remainingWeighting =
      1 -
      weightings
        .filter((e) => e != undefined)
        .reduce((acc, val) => acc + val, 0);
    const weightingPerNotSpecified =
      remainingWeighting /
      (output.length - weightings.filter((e) => typeof e === "number").length);

    weightings = weightings.map((e) => e ?? weightingPerNotSpecified);

    return output.map((td, columnIndex) =>
      React.cloneElement(td, {
        // @ts-expect-error TODO: fix this
        weighting: weightings[columnIndex],
        key: `table_col_${columnIndex}_cell`,
        _firstColumn: columnIndex === 0,
        _lastColumn: columnIndex === output.length - 1,
        _firstRow,
        _lastRow,
      }),
    );
  }, [children, tableWeightings, _firstRow, _lastRow]);

  const extraStyles = [
    ...(Array.isArray(trStyle) ? trStyle : [trStyle]),
    ...(Array.isArray(styleProps) ? styleProps : [styleProps]),
  ].filter((s) => s !== undefined);
  return (
    <View
      {...rest}
      style={[
        {
          display: "flex",
          flexDirection: "row",
        },
        ...extraStyles,
      ]}
    >
      {cells}
    </View>
  );
}
