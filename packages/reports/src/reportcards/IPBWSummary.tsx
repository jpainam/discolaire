import { View } from "@react-pdf/renderer";

import { Table, TableCell, TableHeader, TableRow } from "../table";

const w = [0.8, 0.2];
export function IPBWSummary() {
  return (
    <View style={{ flexDirection: "row", gap: 4, paddingTop: 5 }}>
      <View style={{ flex: 0.6, flexDirection: "row", gap: 4 }}>
        <Table
          weightings={w}
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <TableHeader>
            <TableCell
              w={w[0]}
              style={{
                borderRight: 0,
                marginRight: "4px",
                width: "10px",
              }}
            >
              Travail
            </TableCell>
            <TableCell
              w={w[0]}
              style={{ borderLeft: 0, marginRight: "4px" }}
            ></TableCell>
          </TableHeader>
          <SummaryItem w={w} name="Felicitations" />
          <SummaryItem w={w} name="Encouragements" />
          <SummaryItem w={w} name="Tableau d'honneur" />
          <SummaryItem w={w} name="Avertissement" />
          <SummaryItem w={w} name="Blâme" />
        </Table>

        <Table
          weightings={w}
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <TableHeader>
            <TableCell
              style={{
                borderRight: 0,
                marginRight: "4px",
              }}
            >
              Discipline
            </TableCell>
            <TableCell
              style={{ borderLeft: 0, marginRight: "4px" }}
            ></TableCell>
          </TableHeader>
          <SummaryItem w={w} name="Total absences" value={10} />
          <SummaryItem w={w} name="Justifiees" value={6} />
          <SummaryItem w={w} name="Non justifiees" value={4} />
          <SummaryItem w={w} name="Retards" value={"15h"} />
          <SummaryItem w={w} name="Consigne" value={3} />
        </Table>
        <Table
          weightings={w}
          style={{
            paddingVertical: "2px",
            paddingHorizontal: "2px",
          }}
        >
          <TableHeader>
            <TableCell
              style={{
                borderRight: 0,
              }}
            >
              Performance
            </TableCell>
            <TableCell
              style={{ borderLeft: 0, marginRight: "4px" }}
            ></TableCell>
          </TableHeader>
          <SummaryItem w={w} name="Moy.Max" />
          <SummaryItem w={w} name="Moy.Min" />
          <SummaryItem w={w} name="Moy.Cl" />
          <SummaryItem w={w} name="Taux de reussite" />
          <SummaryItem w={w} name="Mention" />
        </Table>
      </View>
      <View style={{ flex: 0.4 }}>
        <SummaryResult />
      </View>
    </View>
  );
}

function SummaryItem({
  name,
  value,
  w,
}: {
  name: string;
  w: number[];
  value?: React.ReactNode;
}) {
  return (
    <TableRow>
      <TableCell w={w[0]} style={{ marginRight: "4px" }}>
        {name}
      </TableCell>
      <TableCell
        w={w[1]}
        style={{
          justifyContent: "center",
          marginRight: "4px",
        }}
      >
        {value}
      </TableCell>
    </TableRow>
  );
}

function SummaryResult() {
  return (
    <Table
      weightings={w}
      style={{
        paddingHorizontal: "2px",
        paddingVertical: "2px",
      }}
    >
      <TableRow style={{ backgroundColor: "#D7D7D7" }}>
        <TableCell
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Resume des resultats
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          Moyenne
        </TableCell>
        <TableCell
          style={{
            borderLeft: 0,
          }}
        >
          10.62
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          Rang
        </TableCell>
        <TableCell
          style={{
            borderLeft: 0,
          }}
        >
          56 / 77
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            textTransform: "uppercase",
            borderRight: 0,
            fontWeight: "bold",
          }}
        >
          Appreciation
        </TableCell>
        <TableCell
          style={{
            borderLeft: 0,
            fontWeight: "bold",
          }}
        >
          Moyen
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            justifyContent: "center",
            backgroundColor: "#D7D7D7",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Observation
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            borderRight: 0,
          }}
        ></TableCell>
        <TableCell
          style={{
            borderLeft: 0,
            color: "#fff",
          }}
        >
          O
        </TableCell>
      </TableRow>
    </Table>
  );
}
