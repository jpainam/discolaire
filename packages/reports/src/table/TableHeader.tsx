import type { TableRowProps } from "./TableRow";
import TableRow from "./TableRow";

export type TableHeaderProps = TableRowProps;

export default function TableHeader({
  children,
  style,
  ...rest
}: TableHeaderProps) {
  return (
    <TableRow
      {...rest}
      style={{
        fontWeight: "bold",
        ...style,
      }}
    >
      {children}
    </TableRow>
  );
}
