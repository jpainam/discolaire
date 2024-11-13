import type { TableRowProps } from "./TableRow";
import TableRow from "./TableRow";

export type TableHeaderProps = TableRowProps;

export default function TableHeader({
  children,
  style,
  ...rest
}: TableHeaderProps) {
  const extraStyle = [...(Array.isArray(style) ? style : [style])].filter(
    (e) => e !== undefined,
  );
  return (
    <TableRow
      {...rest}
      style={[
        {
          fontWeight: "bold",
        },
        ...extraStyle,
      ]}
    >
      {children}
    </TableRow>
  );
}
