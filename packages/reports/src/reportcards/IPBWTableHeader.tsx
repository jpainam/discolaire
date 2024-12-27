import { Text } from "@react-pdf/renderer";

import "../fonts";

import { TableCell, TableHeader } from "../table";

export function IPBWTableHeader({ W }: { W: number[] }) {
  return (
    <TableHeader
      style={{
        //backgroundColor: "#000",
        //color: "#fff",
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <TableCell
        w={W[0]}
        style={{
          padding: 2,
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Matieres</Text>
      </TableCell>
      <TableCell
        w={W[1]}
        style={{
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Note</Text>
      </TableCell>
      <TableCell
        w={W[2]}
        style={{
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Coef.</Text>
      </TableCell>
      <TableCell
        w={W[3]}
        style={{
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Total</Text>
      </TableCell>
      <TableCell
        w={W[4]}
        style={{
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Rang</Text>
      </TableCell>
      <TableCell
        w={W[5]}
        style={{
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Moy.C</Text>
      </TableCell>
      <TableCell
        w={W[6]}
        style={{
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Min/Max</Text>
      </TableCell>
      <TableCell
        w={W[7]}
        style={{
          justifyContent: "center",

          paddingHorizontal: 2,
        }}
      >
        <Text> Appreciation</Text>
      </TableCell>
    </TableHeader>
  );
}
