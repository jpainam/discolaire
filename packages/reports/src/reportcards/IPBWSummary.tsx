import { View } from "@react-pdf/renderer";

import { Table, TableCell, TableHeader, TableRow } from "../table";

export function IPBWSummary() {
  return (
    <View style={{ flexDirection: "row", gap: 4, paddingTop: 10 }}>
      <Table
        tdStyle={{
          paddingVertical: "2px",
          paddingHorizontal: "2px",
        }}
        weightings={[0.8, 0.2]}
      >
        <TableHeader>
          <TableCell
            style={{
              borderRight: 0,
              width: "10px",
            }}
          >
            Mention
          </TableCell>
          <TableCell style={{ borderLeft: 0 }}></TableCell>
        </TableHeader>
        <SummaryItem name="Felicitations" />
        <SummaryItem name="Encouragements" />
        <SummaryItem name="Tableau d'honneur" />
        <SummaryItem name="Avertissement" />
        <SummaryItem name="Blâme" />
      </Table>
      <Table
        tdStyle={{
          paddingVertical: "2px",
          paddingHorizontal: "2px",
        }}
        weightings={[0.8, 0.2]}
      >
        <TableHeader>
          <TableCell
            style={{
              borderRight: 0,
            }}
          >
            Discipline
          </TableCell>
          <TableCell style={{ borderLeft: 0 }}></TableCell>
        </TableHeader>
        <SummaryItem name="Total absences" value={10} />
        <SummaryItem name="Justifiees" value={6} />
        <SummaryItem name="Non justifiees" value={4} />
        <SummaryItem name="Retards" value={"15h"} />
        <SummaryItem name="Consigne" value={3} />
      </Table>
      <Table
        tdStyle={{
          paddingVertical: "2px",
          paddingHorizontal: "2px",
        }}
        weightings={[0.8, 0.2]}
      >
        <TableHeader>
          <TableCell
            style={{
              borderRight: 0,
            }}
          >
            Performance
          </TableCell>
          <TableCell style={{ borderLeft: 0 }}></TableCell>
        </TableHeader>
        <SummaryItem name="Moy.Max" />
        <SummaryItem name="Moy.Min" />
        <SummaryItem name="Moy.Cl" />
        <SummaryItem name="Taux de reussite" />
        <SummaryItem name="Mention" />
      </Table>
      <SummaryResult />
    </View>
  );
}

function SummaryItem({
  name,
  value,
}: {
  name: string;
  value?: React.ReactNode;
}) {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell
        style={{
          justifyContent: "center",
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
      tdStyle={{
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
